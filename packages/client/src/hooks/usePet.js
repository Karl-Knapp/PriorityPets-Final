import { useContext, useEffect } from "react";
import { petContext } from "../contexts/petContext";
import useAuth from "../hooks/useAuth";
import api from "../util/axiosConfig";

const usePet = () => {
  const { auth } = useAuth();
  const { setCurrentPet } = useAuth();
  const { pet, setPet } = useContext(petContext);
  const { setNewAuth } = useAuth();

  const getPet = async () => {
    if (auth && auth.user.pets.currentPet !== undefined && auth.user.pets.currentPet !== []) {
      api
        .get(`/pets/${auth.user.pets.currentPet}`)
        .then((response) => {
          const { currentPet } = response.data;
          setPet(currentPet);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const createPet = async (formData) => {
    let { name, appearance, userId } = formData;

    try {
      const response = await api.post("pets/", { name, appearance, userId });
      setPet(response.data);
      setCurrentPet(response.data._id);
    } catch (error) {
      console.log("Error occurred while updating the pet:", error);
    }
  };

  const feedPet = async () => {
    try {
      const response = await api.put("pets/feed", { userId: auth.user._id, petId: auth.user.pets.currentPet });
      setPet(response.data.pet);
      setNewAuth(response.data.user);
    } catch (error) {
      console.log("Error occurred while updating the pet:", error);
    }
  };

  useEffect(() => {
    getPet();
  }, [auth]);

  return {
    pet,
    getPet,
    createPet,
    feedPet,
  };
};

export default usePet;

import { useContext } from "react";
import { authContext } from "../contexts/authContext";
import api, { setAuthHeaders } from "../util/axiosConfig";
import { useNavigate } from "react-router-dom";
import { petContext } from "../contexts/petContext";

const useAuth = () => {
  const { auth, setAuth } = useContext(authContext);
  const navigate = useNavigate();
  const { pet, setPet } = useContext(petContext);

  const signUp = async (email, username, password, confirmPassword, onError) => {
    api.post("/auth/signup", { email, username, password, confirmPassword }).catch((error) => {
      onError(error);
    });
  };

  const signIn = async (email, password, onError) => {
    if (email !== "" && password !== "") {
      try {
        const response = await api.post("/auth/signin", { email, password });
        const { token, user } = response.data;

        setAuth({ isAuthenticated: true, user: user });
        setAuthHeaders(token);

        navigate("/TaskPage");

        // Return user object after successful sign in
        return user;
      } catch (error) {
        onError(error);
      }
    }
  };

  const setCurrentPet = (petData) => {
    const updatedUser = { ...auth.user };
    updatedUser.pets.currentPet = petData;

    setAuth({ ...auth, user: updatedUser });
  };

  const setNewAuth = (inputUser) => {
    setAuth({ ...auth, user: inputUser });
  };

  const signOut = () => {
    setAuth({ isAuthenticated: false, user: null }); // Update auth state

    // Clear local storage
    localStorage.removeItem("PriorityUser");

    setPet([]);

    // Navigate to "/"
    navigate("/");
  };

  return {
    auth,
    signUp,
    signIn,
    signOut,
    setCurrentPet,
    setNewAuth,
  };
};

export default useAuth;

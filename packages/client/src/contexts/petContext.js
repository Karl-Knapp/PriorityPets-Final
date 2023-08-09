import { createContext, useState, useEffect } from "react";

export const petContext = createContext();

const getPet = localStorage.getItem("PriorityPet");

let initialPetState;

try {
  initialPetState = JSON.parse(getPet) || {};
} catch (error) {
  initialPetState = {};
}

const PetProvider = ({ children }) => {
  const [pet, setPet] = useState(initialPetState);

  useEffect(() => {
    localStorage.setItem("PriorityPet", JSON.stringify(pet));

    return () => {};
  }, [pet]);

  return (
    <petContext.Provider value={{ pet, setPet }}>
      {children}
    </petContext.Provider>
  );
};

export default PetProvider;

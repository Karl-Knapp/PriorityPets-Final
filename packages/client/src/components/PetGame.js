import React, { useContext } from "react";
import axios from "../util/axiosConfig";
import { petContext } from "../contexts/petContext";
import { authContext } from "../contexts/authContext.js"; 

const PetGame = () => {
  const { pet, setPet } = useContext(petContext); 
  const { auth, setAuth } = useContext(authContext); 


  const feedPet = async () => {
    if (auth.user.points >= 10) {
      const updatedPet = { ...pet };
      updatedPet.healthLevel += 10;

      const updatedUser = { ...auth.user };
      updatedUser.points -= 10;
      updatedUser.pet = updatedPet;

      try {
        await axios.post(`/api/pets/${auth.pets.currentpet}`, {
          username: updatedUser.username,
          xp: updatedUser.xp,
          level: updatedUser.level,
          points: updatedUser.points,
          pet: updatedPet,
        });
        setPet(updatedPet); 
        setAuth({ ...auth, user: updatedUser });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Not enough points to feed the pet!");
    }
  };

  const waterPet = async () => {
    if (auth.user.points >= 5) {
      const updatedPet = { ...pet };
      updatedPet.healthLevel += 5;

      const updatedUser = { ...auth.user };
      updatedUser.points -= 5;
      updatedUser.pet = updatedPet;

      try {
        await axios.post(`/api/pets/${auth.pets.currentpet}`, {
          username: updatedUser.username,
          xp: updatedUser.xp,
          level: updatedUser.level,
          points: updatedUser.points,
          pet: updatedPet,
        });
        setPet(updatedPet); 
        setAuth({ ...auth, user: updatedUser });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Not enough points to water the pet!");
    }
  };

  const playWithPet = async () => {
    if (auth.user.points >= 15) {
      const updatedPet = { ...pet };
      updatedPet.healthLevel += 20;

      const updatedUser = { ...auth.user };
      updatedUser.points -= 15;
      updatedUser.pet = updatedPet;

      try {
        await axios.post(`/api/pets/${auth.pets.currentpet}`, {
          username: updatedUser.username,
          xp: updatedUser.xp,
          level: updatedUser.level,
          points: updatedUser.points,
          pet: updatedPet,
        });
        setPet(updatedPet);
        setAuth({ ...auth, user: updatedUser });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Not enough points to play with the pet!");
    }
  };

  

  if (!auth.user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Pet Game</h1>
      <div>
        {auth.user.pet && <img src={auth.user.pet.appearance} alt="Pet" />}
      </div>
      <div>
        <h2>Health: {pet.healthLevel}</h2> 
        <h2>Points: {auth.user.points}</h2>
      </div>
      <div>
        <button onClick={feedPet}>Feed</button>
        <button onClick={waterPet}>Water</button>
        <button onClick={playWithPet}>Play</button>
      </div>
    </div>
  );
};

export default PetGame;
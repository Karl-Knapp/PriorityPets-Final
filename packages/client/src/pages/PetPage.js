import React, { useState, onEffect, useEffect } from "react";
import PetPicker from "../components/PetPicker";
import "./PetPage.css";
import { Modal, Button } from "react-bootstrap";
import GravePicker from "../components/GravePicker";
import NavBar from "../components/Navbar.js";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import usePet from "../hooks/usePet";
import { petContext } from "../contexts/petContext";
import { toast } from "react-toastify";
import axios from "../util/axiosConfig";

const imgs = ["/x2/Cat_Down@2x.png", "/x2/Chick_Down@2x.png", "/x2/Fox_Down@2x.png", "/x2/Mouse_Down@2x.png", "/x2/Pig_Down@2x.png", "/x2/Rabbit_Down@2x.png"];

function PetPage() {
  const [show, setShow] = useState(false);
  const [showPetName, setShowPetName] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [showPetDiv, setShowPetDiv] = useState(false);
  const [showChooseButton, setShowChooseButton] = useState(true);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [increaseHealth, setIncreaseHealth] = useState("");
  const { auth } = useAuth();
  const [selectedPet, setSelectedPet] = useState(imgs[0]);
  const { pet } = usePet();
  const { createPet, feedPet } = usePet();
  const [formData, setFormData] = useState({
    name: "",
    appearance: "",
    userId: auth.user._id,
  });

  console.log(pet);
  //console.log(auth.user.currentPet);
  console.log(auth.user);

  useEffect(() => {
    if (!(pet.name === undefined)) {
      //console.log("hello");
      showPetDivLogin();
    }
  }, [pet.name]);

  useEffect(() => {
    if (pet.healthLevel === 0) {
      petHealthLevelZero();
    }
  }, [pet.healthLevel]);

  const openModal = (e) => {
    e.preventDefault();
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  const openGraveModal = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const closeGraveModal = () => {
    setOpen(false);
  };

  const petHealthLevelZero = () => {
    setShowPetName(false);
    setSelectedPet(pet.appearance);
    setShowPetDiv(false);
    setShowJumpButton(false);
    setShowChooseButton(false);
  };

  const showPetDivLogin = () => {
    const authPetName = auth.user.pets.currentPet.name;
    if (pet.name === authPetName && pet.name !== undefined && authPetName !== undefined && pet.healthLevel !== 0) {
      setShowPetDiv(true);
      setShowJumpButton(true);
      setShowChooseButton(false);
    } else {
      return;
    }
  };

  const petNameNotEntered = () => {
    if (formData.name === "") {
      return toast("Please enter pet's name");
    }
  };

  const handlePetSelection = async (event) => {
    setShow(false);

    createPet(formData);
  };

  const handleJumpButton = () => {
    setIsActivated(!isActivated);
  };
  const handleButtonClick = () => {
    handlePetSelection();
  };

  const increasePetHealth = () => {
    console.log(pet);
  };

  const handleFeedPet = () => {
    feedPet();
  };

  // console.log(pet.appearance);
  // console.log(showChooseButton);
  // console.log(showPetDiv);
  return (
    <>
      <div className="main-background-div">
        <NavBar />
        {pet.name ? (
          <>
            <h1 className="pet-title-hide">Welcome To Your Pet's Page</h1>
            <h1 className="pet-title">{`${pet.name}'s Forever Home`}</h1>
            <Button className="button-card-hide" onClick={openModal}>
              Choose Your Pet
            </Button>
          </>
        ) : (
          <>
            <h1 className="pet-title">Welcome To Your Pet's Page</h1>

            {/* This button renders differently on the page when the health is greater than 0. */}

            <Button className="button-card" onClick={openModal}>
              Choose Your Pet
            </Button>
          </>
        )}
        {pet.name ? (
          <>
            <div className="game-status-div">
              <div className="current-points">{`Current Points: ${auth.user.points}`}</div>
              <div className="health-bar">
                <div className="health-bar-inner" style={{ width: `${pet.healthLevel}%` }}>
                  Health
                </div>
              </div>
            </div>
            <Button className="feed-pet-btn" onClick={handleFeedPet}>
              Feed Pet
            </Button>
            <Button className="jump-button" onClick={handleJumpButton}>
              Wanna See Me Jump?
            </Button>
          </>
        ) : (
          <Button className="jump-button-hide" onClick={handleButtonClick}>
            Wanna See Me Jump?
          </Button>
        )}

        {/* <div className="current-points">{`Current Points: ${auth.user.points}`}</div>
        <Button onClick={handleFeedPet}>Feed Pet</Button>
        <div className="health-bar">
          <div className="health-bar-inner" style={{ width: `${pet.healthLevel}%` }}>
            Health
          </div>
        </div> */}

        <Modal show={show} className="pet-modal">
          <Modal.Header
            closeButton
            onClick={closeModal}
            style={{
              backgroundColor: "lightblue",
              marginBottom: "-1px",
              color: "darkblue",
              fontSize: "x-large",
              fontWeight: "bolder",
            }}
          >
            Welcome To The Pet Store
          </Modal.Header>
          <PetPicker selected={selectedPet} setSelectedPet={setSelectedPet} formData={formData} setFormData={setFormData} imgs={imgs} handlePetSelection={handlePetSelection} />

          <Button onClick={formData.name ? handlePetSelection : petNameNotEntered} className="handle-pet-btn">
            Choose
          </Button>
        </Modal>
        {/* The cemetary button only renders when the health is 0 */}
        <Button className={pet.healthLevel <= 0 ? "graveyard-button" : "graveyard-button-hide"} onClick={openGraveModal}>
          Visit Pet Cemetary
        </Button>
        <Modal show={open} className="grave-modal">
          <Modal.Header
            closeButton
            onClick={closeGraveModal}
            style={{
              backgroundColor: "lightblue",
              marginBottom: "-1px",
              color: "darkblue",
              fontSize: "x-large",
              fontWeight: "bolder",
            }}
          >
            Revive Your Pet
          </Modal.Header>
          <GravePicker />
          <Button onClick={increasePetHealth}>Restore</Button>
        </Modal>
        {pet.name ? (
          <div className="pet-dec-card">
            <img className="foodBowl" alt="food bowl" src="/accessories/foodbowl.png" />

            <img className="waterBowl" alt="water bowl" src="/accessories/waterbowl.png" />

            <motion.img animate={{ x: value * 8 + "px" }} className={isActivated ? "petty-move" : "petty"} alt="pet" src={handlePetSelection ? pet.appearance : selectedPet} />

            <img className="petHouse" alt="pet house" src="/accessories/pethouse.png" />
          </div>
        ) : (
          <div className="pet-dec-card-hide">
            <img className="foodBowl" alt="food bowl" src="/accessories/foodbowl.png" />

            <img className="waterBowl" alt="water bowl" src="/accessories/waterbowl.png" />

            <motion.img animate={{ x: value * 8 + "px" }} className={isActivated ? "petty-move" : "petty"} alt="pet" src={handlePetSelection ? pet.appearance : selectedPet} />

            <img className="petHouse" alt="pet house" src="/accessories/pethouse.png" />
          </div>
        )}
        <div className="graveyard-holder"></div>
      </div>
    </>
  );
}

export default PetPage;

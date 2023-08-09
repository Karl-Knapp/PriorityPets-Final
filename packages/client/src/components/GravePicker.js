import React from "react";
import "./GravePicker.css";
import useAuth from "../hooks/useAuth";
import usePet from "../hooks/usePet";

function GravePicker({ selected, formData, setFormData, setSelectedPet }) {
  const { pet } = usePet();
  return (
    <div className="grave-modal-container">
      <img className={pet.healthLevel <= 0 ? "modal-grave" : "modal-grave-hide"} alt="pet ghost" src={pet.appearance} />
    </div>
  );
}

export default GravePicker;

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "../util/axiosConfig";
import useAuth from "../hooks/useAuth";
import "./Signup.css";

const Signup = ({ showModal, handleCloseModal, onError }) => {
  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const { signUp } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();

    signUp(data.email, data.username, data.password, data.confirmPassword, onError);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} style={{ backgroundColor: "transparent" }}>
      <Modal.Header closeButton className="signup-header" id="signupModalHeader">
        <Modal.Title>Signup (Please complete all fields)</Modal.Title>
      </Modal.Header>
      <Modal.Body id="signupModalBody" className="sign-up-modal">
        <form onSubmit={handleSignup}>
          <input className="sign-up-input1" type="email" name="email" placeholder="Email" value={data.email} onChange={handleInputChange} />
          <input className="sign-up-input2" type="text" name="username" placeholder="Username" value={data.username} onChange={handleInputChange} />
          <input className="sign-up-input3" type="password" name="password" placeholder="Password" value={data.password} onChange={handleInputChange} />
          <input className="sign-up-input4" type="password" name="confirmPassword" placeholder="Confirm Password" value={data.confirmPassword} onChange={handleInputChange} />
          <Button className="sign-up-button" type="submit" onClick={handleCloseModal}>
            Signup
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Signup;

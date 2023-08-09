import React, { useContext } from "react";
import TaskManagement from "../components/TaskManagement";
import NavBar from "../components/Navbar.js";
import './TaskPage.css'
import { authContext } from "../contexts/authContext";

function TaskPage() {
  const { auth, setAuth } = useContext(authContext);
  return (
    <div className="mainTaskDiv" >
      <NavBar />
    <h1 id="taskPageTitle"> {`${auth.user.username}'s Priorities `} </h1>
    <div id = "taskSection">
      <TaskManagement userEmail={auth.user.email} />
      </div>
    </div>
  );
}

export default TaskPage;

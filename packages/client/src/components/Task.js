import React from "react";
import './Task.css'
import { Container } from "react-bootstrap";

const Task = ({ task, toggleComplete, deleteTask }) => {
  return (
    <div >
      <Container className="task-container">
    <div className={`task ${task.completed ? "completed" : ""}`} >
      <h3 className="task-title">{task.title}</h3>
      <p className="task-details">{task.description}</p>
      <div className="task-actions">
        <button onClick={() => toggleComplete(task.id)}>
          {task.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </div>
    </Container>
    </div>
  );
};

export default Task;

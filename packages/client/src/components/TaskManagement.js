import React, { useState, useEffect } from "react";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import "./TaskManagement.css";
import axios from "../util/axiosConfig";
import useAuth from "../hooks/useAuth";

const bgColor = ["lightblue", "orange", "orangered", "red"];

function TaskManagement({ userEmail }) {
  const { auth } = useAuth();
  const { setNewAuth } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [reminder, setReminder] = useState(new Date());
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);

  // Edit modal state
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editDueDate, setEditDueDate] = useState(null);
  const [editReminder, setEditReminder] = useState(new Date());
  const [showEditModal, setShowEditModal] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  const handleAddTask = () => {
    const newTask = {
      name,
      description,
      priority,
      category,
      dueDate,
      reminder,
      completed: false,
      userEmail,
    };

    // Put axios logic here
    axios
      .post("http://localhost:3001/api/tasks", newTask)
      .then((response) => {
        setTasks([...tasks, response.data]);
      })
      .catch((error) => {
        console.log(error);
        // onError(error);
      });
    // End axios logic

    // Clear input fields
    setName("");
    setDescription("");
    setPriority("");
    setDueDate(null);
    setReminder(new Date());
  };

  const handleDeleteTask = (index, _id) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    axios.delete(`http://localhost:3001/api/tasks/delete/${_id}/${auth.user._id}`).catch((error) => {
      console.log(error);
    });
  };

  const handleCompleteTask = (index, _id) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed; // Toggle the completed value back and forth
    setTasks(updatedTasks);
    axios
      .put(`http://localhost:3001/api/tasks/complete`, { userId: auth.user._id, taskId: _id })
      .then((response) => {
        setNewAuth(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Edit task
  const handleEditTask = (_id) => {
    const updatedTasks = [...tasks];
    const editedTask = {
      ...updatedTasks[editIndex],
      name: editName,
      description: editDescription,
      priority: editPriority,
      dueDate: editDueDate,
      reminder: editReminder,
      userEmail,
    };
    updatedTasks[editIndex] = editedTask;
    setTasks(updatedTasks);

    axios.put(`http://localhost:3001/api/tasks/edit`, { editedTask, taskId: _id }).catch((error) => {
      console.log(error);
    });

    setEditIndex(null);
    setShowEditModal(false);
    setEditName("");
    setEditDescription("");
    setEditPriority("");
    setEditDueDate(null);
    setEditReminder(new Date());
  };

  const openEditModal = (index) => {
    const taskToEdit = tasks[index];
    setEditName(taskToEdit.name);
    setEditDescription(taskToEdit.description);
    setEditPriority(taskToEdit.priority);
    setEditDueDate(taskToEdit.dueDate);
    setEditReminder(taskToEdit.reminder);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    tasks.forEach((task, index) => {
      const dueDate = moment(task.dueDate);
      const now = moment();
      const diff = dueDate.diff(now, "minutes");
      const element = document.getElementById(index); // Get the element with the ID 'index'
      if (element) {
        // Check if the element exists
        if (diff < 30) {
          element.style.backgroundColor = bgColor[3];
        }
      }
    });
  }, [tasks]);

  useEffect(() => {
    // Fetch tasks for the current user
    axios
      .get("/tasks", { params: { userEmail } })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log(error);
        //onError(error);
      });
  }, [userEmail]);

  return (
    <>
      <div className="div-card2">
        <Button className="modalButton" onClick={openModal}>
          Add Task
        </Button>
        <Modal className="modal" show={show} onHide={closeModal}>
          <Modal.Header id="modalHeader" closeButton style={{ marginBottom: "-60px", fontSize: "30px" }}></Modal.Header>
          <div
            className="container mt-5"
            id="modalBody"
            style={{
              borderRadius: "20px",
              marginBottom: "-580px",
            }}
          >
            <h1 className="mb-4" style={{ color: "white" }}>
              Task Manager
            </h1>
            <div className="mb-3">
              <input type="text" className="form-control mb-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <textarea className="form-control mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <select className="form-control mb-2" name="Priority" onChange={(e) => setPriority(e.target.value)}>
                <option value={0}>Priority</option>
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
              </select>
              <span className="dueDateSpan">Set Due Date</span>
              <DateTimePicker className="form-control mb-2 datePicker" value={dueDate} onChange={(date) => setDueDate(date)} placeholder="Due Date" />
              <span className="dueDateSpan">Set Reminder</span>
              <DateTimePicker className="form-control mb-2 datePicker" value={reminder} onChange={(date) => setReminder(date)} placeholder="Reminder" />
              <Button className="float-right mt-3" style={{ borderRadius: "10px" }} onClick={handleAddTask}>
                Add Task
              </Button>
              <Button className="float-right mt-3" style={{ marginLeft: "20px", borderRadius: "10px" }} onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
        {tasks.map((task, index) => (
          <div key={index} className="listDiv">
            <ol>
              <li
                className="task"
                id={index} // Add the ID 'index' to the list item
                style={{
                  backgroundColor: bgColor[parseInt(task.priority)],
                }}
              >
                <div className="holder">
                  {
                    //removed the code that crosses out the check box
                    <input type="checkbox" name="completed" className="completed" checked={task.completed} onChange={() => handleCompleteTask(index, task._id)} />
                  }
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginLeft: "5px",
                    }}
                  >
                    Complete
                  </span>
                  <h2
                    className="name"
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "gray" : "black", // completed changes colors so people can tell
                    }}
                  >
                    {task.name}
                  </h2>
                  {task.description && <div className="description main">{task.description}</div>}
                  <br></br>
                  <div className="main">
                    <span className="priority">
                      Priority:{" "}
                      {parseInt(task.priority) === 0 ? "Low" : parseInt(task.priority) === 1 ? "Medium" : parseInt(task.priority) === 2 ? "High" : `Invalid Priority: ${parseInt(task.priority)}`}
                    </span>

                    <br></br>
                    <span className="para">Due: {task.dueDate ? moment(task.dueDate).format("ddd MMM DD 'YY h:mm") : "-"}</span>
                    <br></br>
                    <span className="para">REM: {task.reminder ? moment(task.reminder).format("ddd MMM DD 'YY h:mm") : "-"}</span>
                    <button className="edit-button" onClick={() => openEditModal(index)}>
                      Edit
                    </button>

                    <Modal //edit task modal
                      className="modal"
                      show={showEditModal}
                      onHide={() => setShowEditModal(false)}
                    >
                      <Modal.Header id="editTaskModalHeader" closeButton style={{ fontSize: "30px", marginBottom: "-70px" }}></Modal.Header>
                      <div
                        id="TaskModalEdit"
                        className="container mt-5"
                        style={{
                          borderRadius: "20px",
                          marginBottom: "-650px",
                        }}
                      >
                        <h1 className="mb-4" style={{ color: "white" }}>
                          Edit Task
                        </h1>
                        <div className="mb-3">
                          <input type="text" className="form-control mb-2" placeholder="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                          <textarea className="form-control mb-2" placeholder="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                          <select className="form-control mb-2" name="Priority" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                            <option value={0}>Priority</option>
                            <option value={0}>Low</option>
                            <option value={1}>Medium</option>
                            <option value={2}>High</option>
                          </select>
                          <span className="dueDateSpan">Set Due Date</span>
                          <DateTimePicker className="form-control mb-2 datePicker" value={editDueDate} onChange={(date) => setEditDueDate(date)} placeholder="Due Date" />
                          <span className="dueDateSpan">Set Reminder</span>
                          <DateTimePicker className="form-control mb-2 datePicker" value={editReminder} onChange={(date) => setEditReminder(date)} placeholder="Reminder" />
                          <Button className="float-right mt-3" onClick={() => handleEditTask(task._id)}>
                            Save Changes
                          </Button>
                          <Button className="float-right mt-3" style={{ marginLeft: "20px" }} onClick={() => setShowEditModal(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Modal>

                    <Button
                      className="btn btn-danger deleteButtonTask"
                      id="taskDeleteButton"
                      style={{ marginLeft: "30px", borderRadius: "10px", fontSize: "larger", marginBottom: "5px" }}
                      onClick={() => handleDeleteTask(index, task._id)}
                    >
                      Delete Task
                    </Button>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        ))}
      </div>
    </>
  );
}

export default TaskManagement;

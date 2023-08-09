import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import useAuth from "../hooks/useAuth";

export default function NavBar() {
  const { signOut } = useAuth();

  return (
    <div className="nav">
      <Link to="/" className="title">
        Priority Pet
      </Link>
      <nav>
        <ul>
          <li>
            <Link className="link" to="/taskpage">
              Priorities
            </Link>
          </li>
          <li>
            <Link className="link" to="/PetPage">
              Pet
            </Link>
          </li>
          <li>
            <span className="link" onClick={signOut}>
              Sign Out
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

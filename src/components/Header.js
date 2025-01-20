import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("https://e-learning-platform-v1-bmdefngmcxdthqbn.westeurope-01.azurewebsites.net//api/Auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Удаляем токен
        onLogout(null);
        navigate("/login"); // Переход на страницу логина
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div id="header">
      <img src="/logo.svg" alt="logo" className="logo" />
      <ul className="navbar">
        <li>
          <Link to="/courses">Courses</Link>
        </li>
        <li>
          <Link to="/teachers">Teachers</Link>
        </li>
        {/* <li>
          <Link to="/dashboards">Dashboards</Link>
        </li> */}
      </ul>
      <div className="user-menu">
        <button className="user" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <img src="/user.svg" alt="user" />
        </button>
        {isMenuOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout} className="logout-button">
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

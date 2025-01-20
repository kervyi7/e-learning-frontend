import React, { useState, useEffect } from "react";
import "./AuthPage.css";
import { getUserFromToken } from "../../utils/token";

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("Student");
  const [tokenRole, setTokenRole] = useState();

  useEffect(() => {
    if (role) {
      // После того как роль обновилась, вызываем onLogin
      onLogin({ username, tokenRole });
    }
  }, [role]);

  const apiBaseUrl = "https://e-learning-platform-v1-bmdefngmcxdthqbn.westeurope-01.azurewebsites.net/api/Auth"; // Укажите базовый URL API

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token.accessToken); // Сохраняем токен в localStorage
        const token = getUserFromToken();
        setTokenRole(token.role);
        setRole(token.role);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/registration/${selectedRole.toLowerCase()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, firstName, lastName, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token.accessToken); // Сохраняем токен в localStorage
        const token = getUserFromToken();
        setTokenRole(token.role);
        setRole(token.role);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };
  const handleWave = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const wave = document.createElement("span");
    wave.className = "wave";
    wave.style.left = `${x - 30}px`;
    wave.style.top = `${y - 30}px`;
    button.appendChild(wave);

    setTimeout(() => {
      wave.remove();
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-buttons">
        <button
          onClick={() => setIsLogin(true)}
          className={isLogin ? "active" : "inactive"}
        >
          Log in
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={!isLogin ? "active" : "inactive"}
        >
          Sign up
        </button>
      </div>

      <div className="auth-form">
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        {!isLogin && (
          <div>
            <div className="auth-form">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="auth-input"
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="auth-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
            <div className="role-selector">
              <label className="role-option">
                <input
                  type="radio"
                  name="selectedRole"
                  value="Student"
                  checked={selectedRole === "Student"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <span>Student</span>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="selectedRole"
                  value="Teacher"
                  checked={selectedRole === "Teacher"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <span>Teacher</span>
              </label>
            </div>
          </div>
        )}
        <button
          onMouseMove={handleWave}
          onClick={isLogin ? handleLogin : handleRegister}
        >
          {isLogin ? "Log in" : "Sign up"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getUserFromToken } from "./utils/token";
import Courses from "./pages/Student/Courses";
import TeachersPage from "./pages/Student/Teachers";
import Dashboard from "./pages/Student/Dashboard";
import AuthPage from "./pages/Auth/AuthPage";
import Home from "./pages/Teacher/Home";
import AddCourse from "./pages/Teacher/Course";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<AuthPage onLogin={handleLogin} />} />
        ) : user.role === "Student" ? (
          <>
            <Route path="/courses" element={<Courses onLogout={handleLogout} />} />
            <Route path="/teachers" element={<TeachersPage onLogout={handleLogout} />} />
            {/* <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} /> */}
            <Route path="*" element={<Navigate to="/courses" />} />
          </>
        ) : (
          <>
            {/* Маршрути для вчителя */}
            <Route path="/home" element={<Home onLogout={handleLogout} />} />
            <Route path="/teacher/upload" element={<AddCourse onLogout={handleLogout} username={user.username}/>} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;

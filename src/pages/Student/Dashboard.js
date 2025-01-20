import React, { useState } from "react";
import Header from "../../components/Header";

const Dashboard = ({ onLogout }) => {
  return (
    <div>
      <Header onLogout={onLogout} />
      <div className="content">
        <h1 className="headerText">Your savings</h1>
      </div>
    </div>
  );
};

export default Dashboard;

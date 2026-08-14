import React from "react";

function Dashboard() {
  return (
    <div>
      <h1 style={{ color: "#00bcd4" }}>Dashboard</h1>

      <p>Welcome to CivicEye AI Dashboard</p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap"
        }}
      >
        <div style={card}>
          <h3>Total Reports</h3>
          <h1>0</h1>
        </div>

        <div style={card}>
          <h3>AI Detections</h3>
          <h1>0</h1>
        </div>

        <div style={card}>
          <h3>Pending</h3>
          <h1>0</h1>
        </div>

        <div style={card}>
          <h3>Resolved</h3>
          <h1>0</h1>
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "15px",
  width: "220px",
  color: "white",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,.3)"
};

export default Dashboard;
import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaSignOutAlt, FaSearch } from "react-icons/fa";

function AdminNavbar({ onLogout, searchTerm, setSearchTerm }) {
  const [currentTime, setCurrentTime] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(90deg, #1e293b, #334155)",
        height: "80px",
        borderRadius: "16px",
        padding: "0 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        border: "1px solid #475569"
      }}
    >
      {/* SEARCH BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#0f172a",
          padding: "10px 18px",
          borderRadius: "12px",
          border: "1px solid #334155",
          width: "350px"
        }}
      >
        <FaSearch color="#06b6d4" style={{ marginRight: "10px" }} />
        <input
          type="text"
          placeholder="Search complaints, locations, or IDs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            outline: "none",
            width: "100%",
            fontSize: "14px"
          }}
        />
      </div>

      {/* RIGHT USER CONTROLS */}
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <div style={{ textAlign: "right", color: "#cbd5e1", fontSize: "13px" }}>
          <div style={{ fontWeight: "bold", color: "#38bdf8" }}>{currentTime}</div>
          <div style={{ color: "#10b981", fontSize: "12px" }}>🟢 Live Backend Connected</div>
        </div>

        {/* NOTIFICATIONS */}
        <div
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#06b6d4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            cursor: "pointer",
            position: "relative"
          }}
        >
          <FaBell size={20} />
          <span
            style={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#ef4444",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "10px",
              fontWeight: "bold"
            }}
          >
            3
          </span>
        </div>

        {/* ADMIN USER PROFILE */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <FaUserCircle size={44} color="#06b6d4" />
          <div>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "15px" }}>
              Municipality Admin 👨‍💼
            </div>
            <div style={{ color: "#94a3b8", fontSize: "12px" }}>
              System Authority Officer
            </div>
          </div>
        </div>

        {/* SIGN OUT */}
        <button
          onClick={onLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>

      {/* NOTIFICATION POPOVER */}
      {showNotifications && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            right: "120px",
            width: "320px",
            background: "#1e293b",
            borderRadius: "14px",
            padding: "20px",
            border: "1px solid #06b6d4",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 1100
          }}
        >
          <h4 style={{ margin: "0 0 15px", color: "#38bdf8" }}>🔔 Admin Notifications</h4>
          <div style={{ borderBottom: "1px solid #334155", paddingBottom: "10px", marginBottom: "10px", fontSize: "13px" }}>
            🚨 <b>High Severity Alert</b>: New Pothole detected on MG Road.
          </div>
          <div style={{ borderBottom: "1px solid #334155", paddingBottom: "10px", marginBottom: "10px", fontSize: "13px" }}>
            ♻️ <b>Solid Waste Update</b>: Waste collection complaint assigned to Ward 45.
          </div>
          <div style={{ fontSize: "13px" }}>
            💧 <b>Water Supply Update</b>: Leakage complaint in Koramangala marked In Progress.
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNavbar;

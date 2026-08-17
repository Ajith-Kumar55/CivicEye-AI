import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar({ onLogout, userRole = "citizen", currentUser = null }) {
  const [currentTime, setCurrentTime] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const displayName =
    userRole === "admin"
      ? "Municipality Admin 👨‍💼"
      : currentUser?.name
      ? `${currentUser.name} 👤`
      : "Citizen User 👤";


  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(90deg,#1e293b,#334155)",
        height: "85px",
        borderRadius: "18px",
        padding: "0 35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,.25)",
        border: "1px solid #475569",
      }}
    >
      {/* LEFT */}

      <div>
        <h2
          style={{
            margin: 0,
            color: "#06b6d4",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          🌍 CivicEye AI
        </h2>

        <p
          style={{
            margin: "5px 0 0",
            color: "#cbd5e1",
            fontSize: "14px",
          }}
        >
          AI Powered Smart Public Issue Detection System
        </p>
      </div>

      {/* RIGHT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            textAlign: "right",
            color: "#cbd5e1",
            fontSize: "13px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
            }}
          >
            {currentTime}
          </div>

          <div>🟢 System Online</div>
        </div>

        {/* Notification */}

        <div
          onClick={() =>
            setShowNotifications(!showNotifications)
          }
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "#06b6d4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <FaBell size={22} />

          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#ef4444",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "11px",
              fontWeight: "700",
            }}
          >
            4
          </span>
        </div>

        {/* User */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaUserCircle
            size={52}
            color="#38bdf8"
          />

          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              {displayName}
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              🟢 Online • AI Accuracy 98.6%
            </div>
          </div>
        </div>
                {/* Logout */}

        <button
          onClick={onLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "700",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Notification Popup */}

      {showNotifications && (
        <div
          style={{
            position: "absolute",
            top: "95px",
            right: "30px",
            width: "340px",
            background: "#1e293b",
            borderRadius: "15px",
            border: "1px solid #334155",
            padding: "20px",
            boxShadow: "0 15px 35px rgba(0,0,0,.35)",
            zIndex: 999,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              color: "#06b6d4",
              marginBottom: "15px",
            }}
          >
            🔔 Notification Center
          </h3>

          <div
            style={{
              padding: "10px",
              background: "#334155",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            🚨 New pothole detected
          </div>

          <div
            style={{
              padding: "10px",
              background: "#334155",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            🗑 Garbage complaint submitted
          </div>

          <div
            style={{
              padding: "10px",
              background: "#334155",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            💧 Water leakage reported
          </div>

          <div
            style={{
              padding: "10px",
              background: "#334155",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            📄 AI report generated successfully
          </div>

          <hr
            style={{
              border: "1px solid #475569",
              margin: "18px 0",
            }}
          />

          <h4
            style={{
              color: "#38bdf8",
              marginBottom: "12px",
            }}
          >
            📊 Today's Statistics
          </h4>

          <p>📋 Total Reports : 126</p>
          <p>🤖 AI Detections : 12</p>
          <p>⚡ System Health : Excellent</p>
          <p>🟢 Server Status : Online</p>
        </div>
      )}
    </div>
  );
}

export default Navbar;
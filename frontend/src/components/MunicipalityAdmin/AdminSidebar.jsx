import React from "react";
import {
  FaChartLine,
  FaClipboardList,
  FaBuilding,
  FaCog,
  FaShieldAlt,
  FaHome
} from "react-icons/fa";

function AdminSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: <FaHome /> },
    { id: "complaints", label: "Complaint Management", icon: <FaClipboardList /> },
    { id: "feed", label: "Resolution Feed", icon: <FaShieldAlt /> },
    { id: "analytics", label: "Issue Statistics", icon: <FaChartLine /> },
    { id: "departments", label: "Department Triage", icon: <FaBuilding /> },
    { id: "settings", label: "Admin Settings", icon: <FaCog /> }
  ];

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        color: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        padding: "25px 15px",
        boxSizing: "border-box",
        borderRight: "1px solid #334155",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div>
        <div
          style={{
            textAlign: "center",
            paddingBottom: "25px",
            borderBottom: "1px solid #334155",
            marginBottom: "25px"
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#06b6d4",
              fontSize: "22px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            🏛️ CivicEye AI
          </h2>
          <span
            style={{
              fontSize: "12px",
              color: "#38bdf8",
              fontWeight: "600",
              letterSpacing: "1px",
              textTransform: "uppercase"
            }}
          >
            Municipality Admin
          </span>
        </div>

        <nav>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? "#fff" : "#94a3b8",
                  background: isActive
                    ? "linear-gradient(90deg, #06b6d4 0%, #0284c7 100%)"
                    : "transparent",
                  boxShadow: isActive ? "0 4px 15px rgba(6, 182, 212, 0.3)" : "none",
                  transition: "all 0.2s ease-in-out"
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span style={{ fontSize: "15px" }}>{item.label}</span>
              </div>
            );
          })}
        </nav>
      </div>

      <div
        style={{
          background: "#1e293b",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #334155",
          textAlign: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#10b981", fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>
          <FaShieldAlt /> Secure Admin Portal
        </div>
        <div style={{ color: "#94a3b8", fontSize: "11px" }}>
          Connected to Municipal DB
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  FaClipboardList,
  FaRobot,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

function DashboardCards({ history, results }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("civiceye_language") || "English"
  );

  useEffect(() => {
    const updateLanguage = () => {
      setLanguage(
        localStorage.getItem("civiceye_language") || "English"
      );
    };

    window.addEventListener(
      "civiceye-language-change",
      updateLanguage
    );

    window.addEventListener("storage", updateLanguage);
    window.addEventListener("focus", updateLanguage);

    return () => {
      window.removeEventListener(
        "civiceye-language-change",
        updateLanguage
      );

      window.removeEventListener(
        "storage",
        updateLanguage
      );

      window.removeEventListener(
        "focus",
        updateLanguage
      );
    };
  }, []);

  const kannada = language === "Kannada";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(260px,1fr))",
        gap: "25px",
        marginBottom: "35px",
      }}
    >
      <Card
        title={
          kannada
            ? "ಒಟ್ಟು ವರದಿಗಳು"
            : "Total Reports"
        }
        value={history.length}
        color="#3b82f6"
        icon={<FaClipboardList />}
        liveText={
          kannada
            ? "ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
            : "Live Dashboard"
        }
      />

      <Card
        title={
          kannada
            ? "AI ಪತ್ತೆಗಳು"
            : "AI Detections"
        }
        value={results.length}
        color="#06b6d4"
        icon={<FaRobot />}
        liveText={
          kannada
            ? "ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
            : "Live Dashboard"
        }
      />

      <Card
        title={
          kannada
            ? "ಬಾಕಿ ಇರುವವು"
            : "Pending"
        }
        value={
          history.filter(
            (h) => h.status === "Pending"
          ).length
        }
        color="#f59e0b"
        icon={<FaExclamationTriangle />}
        liveText={
          kannada
            ? "ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
            : "Live Dashboard"
        }
      />

      <Card
        title={
          kannada
            ? "ಪರಿಹರಿಸಲಾದವು"
            : "Resolved"
        }
        value={
          history.filter(
            (h) => h.status === "Resolved"
          ).length
        }
        color="#10b981"
        icon={<FaCheckCircle />}
        liveText={
          kannada
            ? "ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
            : "Live Dashboard"
        }
      />
    </div>
  );
}

function Card({
  title,
  value,
  color,
  icon,
  liveText,
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#334155)",
        borderRadius: "24px",
        padding: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "160px",
        border: `2px solid ${color}`,
        boxShadow: `0 0 25px ${color}40`,
        transition: "all .35s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-8px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";
      }}
    >
      <div>
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "16px",
            margin: 0,
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </p>

        <h1
          style={{
            color,
            fontSize: "48px",
            margin: "12px 0",
            fontWeight: "800",
          }}
        >
          <CountUp
            start={0}
            end={value}
            duration={2}
          />
        </h1>

        <span
          style={{
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          🟢 {liveText}
        </span>
      </div>

      <div
        style={{
          width: "85px",
          height: "85px",
          borderRadius: "50%",
          background: color,
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "38px",
          boxShadow:
            "0 12px 25px rgba(0,0,0,.35)",
          transition: "0.4s",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default DashboardCards;
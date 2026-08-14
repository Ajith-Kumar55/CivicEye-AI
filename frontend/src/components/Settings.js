import React, { useState } from "react";

function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [confidence, setConfidence] = useState(80);

  const [language, setLanguage] = useState(
    localStorage.getItem("civiceye_language") || "English"
  );

  const kannada = language === "Kannada";

  // Change language immediately without refreshing/logging out
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;

    setLanguage(newLanguage);

    localStorage.setItem(
      "civiceye_language",
      newLanguage
    );

    // Tell Sidebar immediately
    window.dispatchEvent(
      new Event("civiceye-language-change")
    );
  };

  const saveSettings = () => {
    // Save settings WITHOUT refreshing the page
    localStorage.setItem(
      "civiceye_language",
      language
    );

    window.dispatchEvent(
      new Event("civiceye-language-change")
    );

    alert(
      language === "Kannada"
        ? "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!"
        : "Settings saved successfully!"
    );
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(145deg,#0f172a,#1e293b,#334155)",
        borderRadius: "20px",
        padding: "30px",
        marginTop: "35px",
        color: "white",
        boxShadow:
          "0 12px 30px rgba(0,0,0,.30)",
      }}
    >

      {/* SETTINGS TITLE */}
      <h2
        style={{
          color: "#38bdf8",
          marginBottom: "25px",
        }}
      >
        ⚙ {kannada ? "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" : "Settings"}
      </h2>


      {/* DARK THEME */}
      <SettingRow
        title={`🌙 ${
          kannada
            ? "ಡಾರ್ಕ್ ಥೀಮ್"
            : "Dark Theme"
        }`}
        value={
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() =>
              setDarkMode(!darkMode)
            }
          />
        }
      />


      {/* NOTIFICATIONS */}
      <SettingRow
        title={`🔔 ${
          kannada
            ? "ಅಧಿಸೂಚನೆಗಳು"
            : "Notifications"
        }`}
        value={
          <input
            type="checkbox"
            checked={notifications}
            onChange={() =>
              setNotifications(!notifications)
            }
          />
        }
      />


      {/* LANGUAGE */}
      <SettingRow
        title={`🌐 ${
          kannada
            ? "ಭಾಷೆ"
            : "Language"
        }`}
        value={
          <select
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="English">
              English
            </option>

            <option value="Kannada">
              Kannada
            </option>
          </select>
        }
      />


      {/* AI CONFIDENCE */}
      <SettingRow
        title={`🎯 ${
          kannada
            ? "AI ವಿಶ್ವಾಸಾರ್ಹತೆ"
            : "AI Confidence"
        }`}
        value={
          <div>
            <input
              type="range"
              min="50"
              max="100"
              value={confidence}
              onChange={(e) =>
                setConfidence(e.target.value)
              }
            />

            <span
              style={{
                marginLeft: "15px",
              }}
            >
              {confidence}%
            </span>
          </div>
        }
      />


      {/* SAVE SETTINGS */}
      <button
        onClick={saveSettings}
        style={{
          marginTop: "30px",
          background: "#06b6d4",
          color: "#fff",
          border: "none",
          padding: "14px 30px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "700",
        }}
      >
        {kannada
          ? "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ"
          : "Save Settings"}
      </button>

    </div>
  );
}


function SettingRow({
  title,
  value,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 0",
        borderBottom:
          "1px solid #334155",
      }}
    >
      <h4>{title}</h4>

      {value}
    </div>
  );
}


export default Settings;
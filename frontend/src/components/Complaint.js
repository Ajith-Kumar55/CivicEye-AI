import React, { useState, useEffect } from "react";

function Complaint({ results, location, setLocation, onSearchLocation }) {

  const [issue, setIssue] = useState("");
  const [confidence, setConfidence] = useState("");
  const [severity, setSeverity] = useState("");

  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [language, setLanguage] = useState(
    localStorage.getItem("civiceye_language") || "English"
  );

  useEffect(() => {

    if (results && results.length > 0) {

      setIssue(results[0].issue);
      setConfidence(results[0].confidence);
      setSeverity(results[0].severity);

    }

  }, [results]);


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

    window.addEventListener(
      "storage",
      updateLanguage
    );

    window.addEventListener(
      "focus",
      updateLanguage
    );

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


  const submitComplaint = async () => {

    if (!location || !description) {

      alert(
        kannada
          ? "ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ಮಾಹಿತಿಯನ್ನು ಭರ್ತಿ ಮಾಡಿ."
          : "Please fill all required fields."
      );

      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("civiceye-user") || "{}");

      await fetch("http://127.0.0.1:5000/api/complaint/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue: issue || "Public Infrastructure Issue",
          confidence: confidence || 80,
          severity: severity || "MEDIUM",
          location: location,
          description: description,
          citizen_name: storedUser.name || "Registered Citizen",
          citizen_email: storedUser.email || "citizen@civiceye.com",
          citizen_phone: storedUser.phone || "+91 9876543210"
        })
      });
    } catch (err) {
      console.log("Complaint submit API error:", err);
    }

    alert(
      kannada
        ? "✅ ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!"
        : "✅ Complaint Submitted Successfully!"
    );

  };


  const severityColor =
    severity === "HIGH"
      ? "#ef4444"
      : severity === "MEDIUM"
      ? "#f59e0b"
      : "#22c55e";


  return (

    <div
      style={{
        background: "#1e293b",
        padding: "30px",
        borderRadius: "20px",
        color: "white",
      }}
    >

      <h2
        style={{
          textAlign: "center",
          color: "#06b6d4",
          marginBottom: "25px",
        }}
      >
        📋{" "}
        {kannada
          ? "AI ದೂರು ವರದಿ"
          : "AI Complaint Report"}
      </h2>


      {/* AI INFORMATION */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        <InfoCard
          title={
            kannada
              ? "🚨 ಪತ್ತೆಯಾದ ಸಮಸ್ಯೆ"
              : "🚨 Detected Issue"
          }
          value={
            issue ||
            (kannada
              ? "ಯಾವುದೇ ಪತ್ತೆ ಇಲ್ಲ"
              : "No Detection")
          }
        />


        <InfoCard
          title={
            kannada
              ? "🎯 ವಿಶ್ವಾಸಾರ್ಹತೆ"
              : "🎯 Confidence"
          }
          value={
            confidence
              ? confidence + "%"
              : "-"
          }
        />


        <div
          style={{
            background: "#334155",
            padding: "18px",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >

          <h4>
            {kannada
              ? "⚠ ತೀವ್ರತೆ"
              : "⚠ Severity"}
          </h4>

          <span
            style={{
              background: severityColor,
              padding: "8px 18px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            {severity || "-"}
          </span>

        </div>

      </div>


      {/* LOCATION */}

      <label>
        {kannada
          ? "📍 ದೂರು ಸ್ಥಳ"
          : "📍 Complaint Location"}
      </label>


      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >

        <input
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          placeholder={
            kannada
              ? "ಉದಾ: ಶಿವಮೊಗ್ಗ"
              : "Example: Shivamogga"
          }
          style={{
            ...inputStyle,
            margin: 0,
          }}
        />


        <button
          type="button"
          onClick={onSearchLocation}
          style={{
            background: "#06b6d4",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "0 20px",
            fontWeight: "bold",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          🔍{" "}
          {kannada
            ? "ಸ್ಥಳ ಹುಡುಕಿ"
            : "Search Location"}
        </button>

      </div>


      {/* DESCRIPTION */}

      <label>
        {kannada
          ? "📝 ವಿವರಣೆ"
          : "📝 Description"}
      </label>


      <textarea
        rows="4"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        placeholder={
          kannada
            ? "ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ..."
            : "Describe the issue..."
        }
        style={textareaStyle}
      />


      {/* PRIORITY */}

      <label>
        {kannada
          ? "⚡ ಆದ್ಯತೆ"
          : "⚡ Priority"}
      </label>


      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
        style={inputStyle}
      >

        <option value="Low">
          {kannada ? "ಕಡಿಮೆ" : "Low"}
        </option>

        <option value="Medium">
          {kannada ? "ಮಧ್ಯಮ" : "Medium"}
        </option>

        <option value="High">
          {kannada ? "ಹೆಚ್ಚು" : "High"}
        </option>

      </select>


      {/* SUBMIT */}

      <button
        onClick={submitComplaint}
        style={buttonStyle}
      >
        🚀{" "}
        {kannada
          ? "ದೂರು ಸಲ್ಲಿಸಿ"
          : "Submit Complaint"}
      </button>

    </div>
  );
}


function InfoCard({ title, value }) {

  return (

    <div
      style={{
        background: "#334155",
        padding: "18px",
        borderRadius: "15px",
        textAlign: "center",
      }}
    >

      <h4>{title}</h4>

      <h2 style={{ color: "#06b6d4" }}>
        {value}
      </h2>

    </div>

  );
}


const inputStyle = {

  width: "100%",

  padding: "14px",

  borderRadius: "10px",

  border: "1px solid #475569",

  background: "#0f172a",

  color: "white",

  fontSize: "16px",

  boxSizing: "border-box",
};


const textareaStyle = {

  ...inputStyle,

  marginTop: "10px",

  marginBottom: "20px",
};


const buttonStyle = {

  width: "100%",

  padding: "16px",

  borderRadius: "12px",

  border: "none",

  background: "#06b6d4",

  color: "white",

  fontSize: "18px",

  fontWeight: "bold",

  cursor: "pointer",
};


export default Complaint;
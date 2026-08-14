import React, { useEffect, useState } from "react";

function UploadSection({
  preview,
  handleImageChange,
  uploadImage
}) {
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
        background: "#1e293b",
        borderRadius: "20px",
        padding: "25px",
        marginBottom: "25px",
        boxShadow: "0 0 15px rgba(0,0,0,0.3)"
      }}
    >
      <h2
        style={{
          color: "#06b6d4",
          marginBottom: "20px"
        }}
      >
        📤{" "}
        {kannada
          ? "ರಸ್ತೆಯ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ"
          : "Upload Road Image"}
      </h2>

      <input
        type="file"
        onChange={handleImageChange}
        style={{
          marginBottom: "20px",
          color: "white"
        }}
      />

      <br />

      <button
        onClick={uploadImage}
        style={{
          background: "#06b6d4",
          color: "white",
          border: "none",
          padding: "12px 28px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "10px"
        }}
      >
        {kannada
          ? "ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಪತ್ತೆಹಚ್ಚಿ"
          : "Upload & Detect"}
      </button>

      {preview && (
        <div
          style={{
            marginTop: "25px",
            textAlign: "center"
          }}
        >
          <img
            src={preview}
            alt="preview"
            style={{
              width: "420px",
              maxWidth: "100%",
              borderRadius: "15px",
              border: "4px solid #06b6d4"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default UploadSection;
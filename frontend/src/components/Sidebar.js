import React, { useState, useEffect } from "react";

import {
  FaHome,
  FaUpload,
  FaCamera,
  FaClipboardList,
  FaChartBar,
  FaHistory,
  FaMapMarkedAlt
} from "react-icons/fa";


function Sidebar() {

  const [language, setLanguage] = useState(
    localStorage.getItem("civiceye_language") || "English"
  );

  const kannada = language === "Kannada";


  useEffect(() => {

    const handleLanguageChange = () => {

      setLanguage(
        localStorage.getItem("civiceye_language") || "English"
      );

    };


    window.addEventListener(
      "civiceye-language-change",
      handleLanguageChange
    );


    return () => {

      window.removeEventListener(
        "civiceye-language-change",
        handleLanguageChange
      );

    };

  }, []);


  const scrollToSection = (id) => {

    const section =
      document.getElementById(id);

    if (!section) {

      console.log("Section not found:", id);

      return;

    }


    section.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });

  };


  return (

    <div

      style={{

        width: "240px",

        height: "100vh",

        background: "#111827",

        color: "white",

        position: "fixed",

        top: 0,

        left: 0,

        padding: "20px",

        boxSizing: "border-box",

        overflowY: "auto",

        borderRight:
          "2px solid #1f2937",

        zIndex: 1000

      }}

    >

      <h2

        style={{

          textAlign: "center",

          color: "#06b6d4",

          marginBottom: "35px"

        }}

      >

        🌍 CivicEye AI

      </h2>


      <Menu

        icon={<FaHome />}

        text={
          kannada
            ? "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
            : "Dashboard"
        }

        onClick={() =>
          scrollToSection("dashboard")
        }

      />


      <Menu

        icon={<FaUpload />}

        text={
          kannada
            ? "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್"
            : "Upload Image"
        }

        onClick={() =>
          scrollToSection("upload")
        }

      />


      <Menu

        icon={<FaCamera />}

        text={
          kannada
            ? "ಲೈವ್ ಕ್ಯಾಮೆರಾ"
            : "Live Camera"
        }

        onClick={() =>
          scrollToSection("camera")
        }

      />


      <Menu

        icon={<FaClipboardList />}

        text={
          kannada
            ? "ದೂರು"
            : "Complaint"
        }

        onClick={() =>
          scrollToSection("complaint")
        }

      />


      <Menu

        icon={<FaChartBar />}

        text={
          kannada
            ? "ವಿಶ್ಲೇಷಣೆ"
            : "Analytics"
        }

        onClick={() =>
          scrollToSection("analytics")
        }

      />


      <Menu

        icon={<FaHistory />}

        text={
          kannada
            ? "ಇತಿಹಾಸ"
            : "History"
        }

        onClick={() =>
          scrollToSection("history")
        }

      />


      <Menu

        icon={<FaMapMarkedAlt />}

        text={
          kannada
            ? "ಮಹಾನಗರ ನವೀಕರಣಗಳು"
            : "Municipality Updates"
        }

        onClick={() =>
          scrollToSection("resolution-feed")
        }

      />


      <Menu

        icon={<FaMapMarkedAlt />}

        text={
          kannada
            ? "ಗೂಗಲ್ ನಕ್ಷೆ"
            : "Google Map"
        }

        onClick={() =>
          scrollToSection("complaint")
        }

      />


    </div>

  );

}


function Menu({

  icon,

  text,

  onClick

}) {

  return (

    <div

      onClick={onClick}

      style={{

        display: "flex",

        alignItems: "center",

        gap: "15px",

        padding: "14px 16px",

        marginBottom: "12px",

        borderRadius: "12px",

        background: "#1f2937",

        cursor: "pointer",

        transition: "0.3s"

      }}

      onMouseEnter={(e) => {

        e.currentTarget.style.background =
          "#06b6d4";

      }}

      onMouseLeave={(e) => {

        e.currentTarget.style.background =
          "#1f2937";

      }}

    >

      <span

        style={{

          color: "#06b6d4",

          fontSize: "20px"

        }}

      >

        {icon}

      </span>


      <span

        style={{

          fontSize: "16px",

          fontWeight: "500"

        }}

      >

        {text}

      </span>


    </div>

  );

}


export default Sidebar;
import React, { useRef, useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardCards from "./components/DashboardCards";
import Complaint from "./components/Complaint";
import AnalyticsChart from "./components/AnalyticsChart";
import GoogleMap from "./components/GoogleMap";
import Login from "./components/Login";
import UploadSection from "./components/UploadSection";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Settings from "./components/Settings";
const API_BASE_URL = "https://civiceye-ai-bmgu.onrender.com";
import History from "./components/History";
function App() {

  // ======================
  // STATES
  // ======================

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [complaintLocation, setComplaintLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [predictionImage, setPredictionImage] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [citizenView, setCitizenView] = useState("home");

  // ======================
  // START CAMERA
  // ======================

  const startCamera = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true
        });

      videoRef.current.srcObject = stream;

      setCameraOn(true);

    }

    catch (err) {

      console.log(err);

      alert("Cannot access camera");

    }

  };

  // ======================
  // STOP CAMERA
  // ======================

  const stopCamera = () => {

    if (videoRef.current?.srcObject) {

      videoRef.current.srcObject
        .getTracks()
        .forEach(track => track.stop());

      videoRef.current.srcObject = null;

    }

    setCameraOn(false);

  };

  // ======================
  // SELECT IMAGE
  // ======================

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    setPreview(URL.createObjectURL(file));

  };

  // ======================
  // IMAGE UPLOAD
  // ======================

  const uploadImage = async () => {

    if (!selectedImage) {

      alert("Select image first");

      return;

    }

    const formData = new FormData();

    formData.append("image", selectedImage);

    try {
setLoading(true);
      const response = await fetch(
        API_BASE_URL + "/detect",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      console.log(data);

      setResults(data.detections || []);

      setPredictionImage(
        data.prediction_image || ""
      );

      fetchHistory();
      setLoading(false);

    }

    catch (err) {

      console.log(err);
setLoading(false);
      alert("Upload Failed");

    }

  };

  // ======================
  // CAMERA CAPTURE
  // ======================

  const captureImage = async () => {

    if (!cameraOn) {

      alert("Start camera first");

      return;

    }

    const video = videoRef.current;

    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(

      async (blob) => {

        const formData = new FormData();

        formData.append(
          "image",
          blob,
          "capture.jpg"
        );

        const response = await fetch(

          API_BASE_URL + "/detect",

          {
            method: "POST",
            body: formData
          }

        );

        const data = await response.json();

        console.log(data);

        setResults(data.detections || []);

        setPredictionImage(
          data.prediction_image || ""
        );

        fetchHistory();

      },

      "image/jpeg"

    );

  };

// ======================
// HISTORY
// ======================

const updateComplaintStatus = (index, newStatus) => {

  setHistory((currentHistory) => {

    return currentHistory.map((item, itemIndex) => {

      if (itemIndex === index) {
        return {
          ...item,
          status: newStatus
        };
      }

      return item;

    });

  });

};


  const fetchHistory = async () => {

    try {

      const response =
        await fetch(
          API_BASE_URL + "/history"
        );

      const data = await response.json();

      setHistory(data);

    }

    catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchHistory();

    return () => {

      stopCamera();

    };

  }, []);
 const downloadReport = async (item) => {

  const kannada =
    localStorage.getItem("civiceye_language") === "Kannada";

  const report = document.createElement("div");

  report.style.position = "fixed";
  report.style.left = "-10000px";
  report.style.top = "0";
  report.style.width = "700px";
  report.style.padding = "35px";
  report.style.background = "white";
  report.style.color = "#111827";
  report.style.fontFamily =
    "'Nirmala UI', 'Noto Sans Kannada', Arial, sans-serif";
  report.style.fontSize = "16px";
  report.style.lineHeight = "1.6";

  let action = "";

  if (
    item.issue &&
    item.issue.toLowerCase().includes("pothole")
  ) {
    action = kannada
      ? "ರಸ್ತೆ ನಿರ್ವಹಣೆ ಅಗತ್ಯ."
      : "Road Maintenance Required.";
  } else if (
    item.issue &&
    item.issue.toLowerCase().includes("garbage")
  ) {
    action = kannada
      ? "ಪುರಸಭೆಯ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ ಅಗತ್ಯ."
      : "Municipal Waste Collection Required.";
  } else {
    action = kannada
      ? "ನೀರು ಸರಬರಾಜು ಇಲಾಖೆಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯ."
      : "Water Supply Department Inspection Required.";
  }

  report.innerHTML = `
    <div style="
      background:#06b6d4;
      color:white;
      padding:25px;
      border-radius:10px;
    ">
      <h1 style="margin:0;">
        CIVICEYE AI
      </h1>

      <p style="margin-bottom:0;">
        ${
          kannada
            ? "ಸ್ಮಾರ್ಟ್ ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆ ಪತ್ತೆ ವರದಿ"
            : "Smart Public Issue Detection Report"
        }
      </p>
    </div>

    <h2 style="color:#0891b2;">
      ${
        kannada
          ? "ಪತ್ತೆ ಸಾರಾಂಶ"
          : "Detection Summary"
      }
    </h2>

    <div style="
      background:#f8fafc;
      padding:20px;
      border-radius:10px;
    ">

      <p>
        <b>
          ${kannada ? "ಸಮಸ್ಯೆ" : "Issue"}:
        </b>
        ${item.issue || "-"}
      </p>

      <p>
        <b>
          ${kannada ? "ವಿಶ್ವಾಸಾರ್ಹತೆ" : "Confidence"}:
        </b>
        ${item.confidence || 0}%
      </p>

      <p>
        <b>
          ${kannada ? "ತೀವ್ರತೆ" : "Severity"}:
        </b>
        ${item.severity || "-"}
      </p>

      <p>
        <b>
          ${kannada ? "ಸ್ಥಿತಿ" : "Status"}:
        </b>
        ${item.status || "-"}
      </p>

      <p>
        <b>
          ${kannada ? "ದಿನಾಂಕ" : "Date"}:
        </b>
        ${new Date().toLocaleDateString()}
      </p>

      <p>
        <b>
          ${kannada ? "ಸಮಯ" : "Time"}:
        </b>
        ${new Date().toLocaleTimeString()}
      </p>

    </div>

    <h3 style="color:#0891b2;">
      ${
        kannada
          ? "ಸೂಚಿಸಲಾದ ಕ್ರಮ"
          : "Suggested Action"
      }
    </h3>

    <p style="
      background:#ecfeff;
      padding:20px;
      border-left:5px solid #06b6d4;
    ">
      ${action}
    </p>

    <hr />

    <p style="color:#64748b;">
      ${
        kannada
          ? "CivicEye AI - ಸ್ಮಾರ್ಟ್ ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆ ಪತ್ತೆ ವ್ಯವಸ್ಥೆಯಿಂದ ರಚಿಸಲಾಗಿದೆ"
          : "Generated by CivicEye AI - Smart Public Issue Detection System"
      }
    </p>
  `;

  document.body.appendChild(report);

  try {

    const canvas = await html2canvas(report, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 10;

    const availableWidth =
      pageWidth - margin * 2;

    const imageHeight =
      (canvas.height * availableWidth) /
      canvas.width;

    let heightLeft = imageHeight;
    let position = margin;

    pdf.addImage(
      imageData,
      "PNG",
      margin,
      position,
      availableWidth,
      imageHeight
    );

    heightLeft -=
      pageHeight - margin * 2;

    while (heightLeft > 0) {

      position =
        heightLeft -
        imageHeight +
        margin;

      pdf.addPage();

      pdf.addImage(
        imageData,
        "PNG",
        margin,
        position,
        availableWidth,
        imageHeight
      );

      heightLeft -=
        pageHeight - margin * 2;
    }

    pdf.save(
      `CivicEye_Report_${item.issue}.pdf`
    );

  } catch (error) {

    console.error(
      "PDF generation error:",
      error
    );

    alert(
      kannada
        ? "PDF ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
        : "Unable to generate PDF."
    );

  } finally {

    document.body.removeChild(report);

  }
};
const searchComplaintLocation = async () => {

  if (!complaintLocation.trim()) {
    alert("Please enter a location first.");
    return;
  }

  try {

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        complaintLocation
      )}`
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      alert(
        "Location not found. Please enter a more specific place."
      );
      return;
    }

    setSelectedLocation({
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    });

  } catch (error) {

    console.error("Location search error:", error);

    alert("Unable to search this location.");
  }
};
// ======================
// RETURN
// ======================

if (!loggedIn) {
  return (
    <Login
      onLogin={() => setLoggedIn(true)}
    />
  );
}

return (
    <div
  style={{
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial"
  }}
>
  <Sidebar />

  <div
  id="dashboard"
  style={{
    marginLeft: "250px",
    padding: "25px"
  }}
>
    <Navbar
  onLogout={() => {
    setLoggedIn(false);
    setUserRole("");
    setCitizenView("home");
    setShowLanding(true);
  }}
/>

    <h1
      style={{
        textAlign: "center",
        color: "#06b6d4",
        marginBottom: "30px"
      }}
    >
      CivicEye AI
    </h1>

    <DashboardCards
      history={history}
      results={results}
    />

  {/* IMAGE UPLOAD */}

<div id="upload">
  <UploadSection
    preview={preview}
    loading={loading}
    handleImageChange={handleImageChange}
    uploadImage={uploadImage}
  />
</div>

    {/* CAMERA */}

<div
  id="camera"
  style={{
    background: "linear-gradient(180deg,#1e293b,#334155)",
    padding: "35px",
    borderRadius: "20px",
    marginBottom: "30px",
    boxShadow: "0 12px 30px rgba(0,0,0,.30)"
  }}
>

  <h2
    style={{
      color: "#38bdf8",
      fontSize: "30px",
      marginBottom: "25px"
    }}
  >
    📷{" "}
    {localStorage.getItem("civiceye_language") === "Kannada"
      ? "ಲೈವ್ ಕ್ಯಾಮೆರಾ ಪತ್ತೆ"
      : "Live Camera Detection"}
  </h2>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: "25px"
    }}
  >

    <video
      ref={videoRef}
      autoPlay
      playsInline
      width="700"
      style={{
        borderRadius: "18px",
        border: "3px solid #06b6d4",
        background: "#000",
        boxShadow: "0 10px 25px rgba(0,0,0,.35)"
      }}
    />

    <canvas
      ref={canvasRef}
      style={{
        display: "none"
      }}
    />

  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap"
    }}
  >

    <button
      style={{
        background: "#16a34a",
        color: "#fff",
        border: "none",
        padding: "14px 28px",
        borderRadius: "12px",
        fontSize: "17px",
        fontWeight: "700",
        cursor: "pointer"
      }}
      onClick={startCamera}
    >
      ▶{" "}
      {localStorage.getItem("civiceye_language") === "Kannada"
        ? "ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ"
        : "Start Camera"}
    </button>


    <button
      style={{
        background: "#dc2626",
        color: "#fff",
        border: "none",
        padding: "14px 28px",
        borderRadius: "12px",
        fontSize: "17px",
        fontWeight: "700",
        cursor: "pointer"
      }}
      onClick={stopCamera}
    >
      ⏹{" "}
      {localStorage.getItem("civiceye_language") === "Kannada"
        ? "ಕ್ಯಾಮೆರಾ ನಿಲ್ಲಿಸಿ"
        : "Stop Camera"}
    </button>


    <button
      style={{
        background: "#06b6d4",
        color: "#fff",
        border: "none",
        padding: "14px 28px",
        borderRadius: "12px",
        fontSize: "17px",
        fontWeight: "700",
        cursor: "pointer"
      }}
      onClick={captureImage}
    >
      📸{" "}
      {localStorage.getItem("civiceye_language") === "Kannada"
        ? "ಸೆರೆಹಿಡಿದು ಪತ್ತೆಹಚ್ಚಿ"
        : "Capture & Detect"}
    </button>

  </div>

</div>

    {/* AI IMAGE */}

    {predictionImage && (

      <div style={sectionStyle}>

        <h2>AI Detection Image</h2>

        <img
          src={predictionImage}
          alt=""
          style={{
            width: "100%",
            maxWidth: "750px",
            borderRadius: "15px"
          }}
        />

      </div>

    )}

   {/* RESULTS */}

<div style={sectionStyle}>

  <h2
    style={{
      color: "#38bdf8",
      textAlign: "center",
      fontSize: "30px",
      marginBottom: "25px"
    }}
  >
    📄{" "}
    {localStorage.getItem("civiceye_language") === "Kannada"
      ? "CivicEye AI ಪತ್ತೆ ವರದಿ"
      : "CivicEye AI Detection Report"}
  </h2>

  {
    results.length === 0 ? (

      <div
        style={{
          textAlign: "center",
          padding: "50px",
          color: "#94a3b8",
          fontSize: "18px"
        }}
      >
        {
          localStorage.getItem("civiceye_language") === "Kannada"
            ? "ಇನ್ನೂ ಯಾವುದೇ ಪತ್ತೆಯಾಗಿಲ್ಲ"
            : "No Detection Yet"
        }
      </div>

    ) : (

      results.map((item, index) => (

        <div
          key={index}
          style={{
            background:
              "linear-gradient(145deg,#0f172a,#1e293b,#334155)",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "25px",
            borderLeft: "6px solid #06b6d4",
            boxShadow: "0 12px 30px rgba(0,0,0,.30)"
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#38bdf8"
            }}
          >
            🛰{" "}
            {localStorage.getItem("civiceye_language") === "Kannada"
              ? "CivicEye AI ವರದಿ"
              : "CivicEye AI Report"}
          </h2>

          <hr
            style={{
              border: "1px solid #334155"
            }}
          />

          <p>
            <b>
              📌{" "}
              {localStorage.getItem("civiceye_language") === "Kannada"
                ? "ಸಮಸ್ಯೆ"
                : "Issue"} :
            </b>{" "}
            {item.issue}
          </p>

          <p>
            <b>
              🎯{" "}
              {localStorage.getItem("civiceye_language") === "Kannada"
                ? "ವಿಶ್ವಾಸಾರ್ಹತೆ"
                : "Confidence"} :
            </b>{" "}
            {item.confidence}%
          </p>

          <p>
            <b>
              🚨{" "}
              {localStorage.getItem("civiceye_language") === "Kannada"
                ? "ತೀವ್ರತೆ"
                : "Severity"} :
            </b>{" "}
            {item.severity}
          </p>

          <p>
            <b>
              📍{" "}
              {localStorage.getItem("civiceye_language") === "Kannada"
                ? "ಸ್ಥಿತಿ"
                : "Status"} :
            </b>{" "}
            {item.status}
          </p>

          <p>
            <b>
              📅{" "}
              {localStorage.getItem("civiceye_language") === "Kannada"
                ? "ದಿನಾಂಕ"
                : "Date"} :
            </b>{" "}
            {new Date().toLocaleDateString()}
          </p>

          <p>
            <b>
              🕒{" "}
              {localStorage.getItem("civiceye_language") === "Kannada"
                ? "ಸಮಯ"
                : "Time"} :
            </b>{" "}
            {new Date().toLocaleTimeString()}
          </p>

          <p>

            <b>
              💡{" "}
              {localStorage.getItem("civiceye_language") === "Kannada"
                ? "ಸೂಚಿಸಲಾದ ಕ್ರಮ"
                : "Suggested Action"} :
            </b>

            {
              item.issue === "pothole"
                ? (
                  localStorage.getItem("civiceye_language") === "Kannada"
                    ? " ರಸ್ತೆ ನಿರ್ವಹಣೆ ಅಗತ್ಯ"
                    : " Road Maintenance Required"
                )
                : item.issue === "garbage"
                ? (
                  localStorage.getItem("civiceye_language") === "Kannada"
                    ? " ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ ಅಗತ್ಯ"
                    : " Waste Collection Required"
                )
                : (
                  localStorage.getItem("civiceye_language") === "Kannada"
                    ? " ನೀರು ಸರಬರಾಜು ಇಲಾಖೆಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯ"
                    : " Water Supply Department Required"
                )
            }

          </p>

          <button
            onClick={() => downloadReport(item)}
            style={{
              marginTop: "20px",
              background: "#06b6d4",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700"
            }}
          >
            📄{" "}
            {localStorage.getItem("civiceye_language") === "Kannada"
              ? "PDF ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
              : "Download PDF Report"}
          </button>

        </div>

      ))

    )
  }

</div>

{/* CHART / ANALYTICS */}

<div
  id="analytics"
  style={{
    ...sectionStyle,
    minHeight: "500px",
    scrollMarginTop: "30px",
    display: "block",
    width: "100%",
    boxSizing: "border-box"
  }}
>
  <h2
    style={{
      color: "#38bdf8",
      textAlign: "center",
      fontSize: "28px",
      marginBottom: "25px"
    }}
  >
    📊 Analytics Dashboard
  </h2>

  <AnalyticsChart history={history} />
</div>

<div id="complaint" style={sectionStyle}>

  <Complaint
    results={results}
    location={complaintLocation}
    setLocation={setComplaintLocation}
    onSearchLocation={searchComplaintLocation}
  />

  <br />

  <GoogleMap
    history={history}
    selectedLocation={selectedLocation}
  />

  <br />

  <Settings />

</div>

{/* HISTORY */}

<div id="history" style={sectionStyle}>

  <History
    history={history}
    clearHistory={() => setHistory([])}
    updateStatus={updateComplaintStatus}
    userRole={userRole}
  />

</div>


{/* Main Container Ends */}

</div>

</div>

);

}


const sectionStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "15px",
  marginBottom: "30px",
};

const resultStyle = {
  background: "#334155",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "15px",
};

const buttonStyle = {
  background: "#06b6d4",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  color: "white",
};

export default App;
import React from "react";

import {
  FaTrash,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaMapMarkerAlt
} from "react-icons/fa";
import StatusTimeline from "./StatusTimeline";


function History({
  history,
  clearHistory,
  updateStatus,
  userRole,
  onViewMap
}) {

  const [language, setLanguage] = React.useState(
    localStorage.getItem("civiceye_language") || "English"
  );
  const kannada = language === "Kannada";
  const [confirmModalItem, setConfirmModalItem] = React.useState(null);
  const [localList, setLocalList] = React.useState(history || []);

  React.useEffect(() => {
    setLocalList(history || []);
  }, [history]);

  const handleCitizenRemove = async (item) => {
    try {
      const userObj = JSON.parse(localStorage.getItem("civiceye-user") || "{}");
      const userEmail = userObj.email || item.citizen_email || "citizen@civiceye.com";

      const res = await fetch(`http://127.0.0.1:5000/api/complaints/${item.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: userEmail })
      });

      if (res.ok) {
        setConfirmModalItem(null);
        setLocalList((prev) => prev.filter((c) => c.id !== item.id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove complaint.");
      }
    } catch (err) {
      console.error("Error removing complaint:", err);
      alert("Network error removing complaint.");
    }
  };

  React.useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("civiceye_language") || "English");
    };
    window.addEventListener("civiceye-language-change", handleLanguageChange);
    return () => {
      window.removeEventListener("civiceye-language-change", handleLanguageChange);
    };
  }, []);

  const getSeverityColor = (severity) => {

    if (severity === "HIGH") {
      return "#ef4444";
    }

    if (severity === "MEDIUM") {
      return "#f59e0b";
    }

    return "#10b981";
  };


  const getStatusColor = (status) => {

    if (status === "Resolved") {
      return "#10b981";
    }

    if (status === "In Progress") {
      return "#3b82f6";
    }

    return "#f59e0b";
  };


  const getStatusIcon = (status) => {

    if (status === "Resolved") {
      return <FaCheckCircle />;
    }

    if (status === "In Progress") {
      return <FaSpinner />;
    }

    return <FaExclamationTriangle />;
  };


  const canChangeStatus =
    userRole === "officer" ||
    userRole === "admin" ||
    userRole === "Admin" ||
    userRole === "authority" ||
    userRole === "Authority";


  return (

    <div
      style={{
        background: "#1e293b",
        color: "white",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "25px"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >

        <h2
          style={{
            color: "#38bdf8",
            margin: 0
          }}
        >
          🔄 Complaint History
        </h2>


        <button
          onClick={clearHistory}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >

          <FaTrash />

          {" "}

          Clear History

        </button>

      </div>


      {/* NO HISTORY */}

      {history.length === 0 ? (

        <div
          style={{
            textAlign: "center",
            padding: "50px",
            color: "#94a3b8",
            fontSize: "18px"
          }}
        >

          No complaint history available.

        </div>

      ) : (

        localList.map((item, index) => {

          const status =
            item.status || "Pending";


          const hasLocation =
            item.latitude !== undefined &&
            item.longitude !== undefined &&
            item.latitude !== null &&
            item.longitude !== null;


          return (

            <div
              key={index}
              style={{
                background: "#334155",
                borderLeft:
                  `6px solid ${getSeverityColor(
                    item.severity
                  )}`,
                borderRadius: "16px",
                padding: "20px",
                marginTop: "18px"
              }}
            >

              {/* MAIN CONTENT */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap"
                }}
              >

                {/* LEFT INFORMATION */}

                <div>

                  <h3
                    style={{
                      margin: 0,
                      color: "#38bdf8"
                    }}
                  >

                    CEV-{1001 + index}

                    {" • "}

                    {item.issue}

                  </h3>


                  <p>

                    <strong>
                      Confidence:
                    </strong>

                    {" "}

                    {item.confidence}%

                  </p>


                  <p>

                    <strong>
                      Severity:
                    </strong>

                    {" "}

                    <span
                      style={{
                        color:
                          getSeverityColor(
                            item.severity
                          ),
                        fontWeight: "700"
                      }}
                    >

                      {item.severity}

                    </span>

                  </p>


                  <p>

                    <strong>
                      Reported:
                    </strong>

                    {" "}

                    <FaCalendarAlt />

                    {" "}

                    {item.time}

                  </p>


                  {/* LOCATION */}

                  {hasLocation && (

                    <div
                      style={{
                        marginTop: "15px",
                        padding: "12px",
                        background: "#0f172a",
                        borderRadius: "10px"
                      }}
                    >

                      <div
                        style={{
                          color: "#38bdf8",
                          fontWeight: "700",
                          marginBottom: "6px"
                        }}
                      >

                        <FaMapMarkerAlt />

                        {" "}

                        Complaint Location

                      </div>


                      <div
                        style={{
                          color: "#cbd5e1",
                          fontSize: "14px"
                        }}
                      >

                        Latitude:{" "}

                        {Number(
                          item.latitude
                        ).toFixed(6)}

                        <br />

                        Longitude:{" "}

                        {Number(
                          item.longitude
                        ).toFixed(6)}

                      </div>


                      {/* VIEW MAP BUTTON */}

                      <button
                        onClick={() => {

                          if (onViewMap) {

                            onViewMap(
                              Number(item.latitude),
                              Number(item.longitude)
                            );

                          }

                        }}

                        style={{
                          marginTop: "10px",
                          background: "#06b6d4",
                          color: "white",
                          border: "none",
                          padding: "9px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "7px"
                        }}
                      >

                        <FaMapMarkerAlt />

                        View on Map

                      </button>

                    </div>

                  )}

                </div>


                {/* STATUS */}

                <div
                  style={{
                    minWidth: "220px",
                    textAlign: "right"
                  }}
                >

                  {/* CURRENT STATUS */}

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "9px 15px",
                      borderRadius: "20px",
                      background:
                        getStatusColor(
                          status
                        ),
                      color: "white",
                      fontWeight: "700",
                      marginBottom:
                        canChangeStatus
                          ? "12px"
                          : "0"
                    }}
                  >

                    {getStatusIcon(status)}

                    {status}

                  </div>


                  {/* OFFICIAL STATUS CONTROL */}

                  {canChangeStatus && (

                    <select
                      value={status}
                      onChange={(e) => {

                        if (updateStatus) {

                          updateStatus(
                            index,
                            e.target.value
                          );

                        }

                      }}

                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          "1px solid #475569",
                        background: "#0f172a",
                        color: "white",
                        cursor: "pointer",
                        marginTop: "8px"
                      }}
                    >

                      <option value="Pending">
                        🟡 Pending
                      </option>

                      <option value="In Progress">
                        🔵 In Progress
                      </option>

                      <option value="Resolved">
                        🟢 Resolved
                      </option>

                    </select>

                  )}

                </div>

              </div>


              {/* COMPLAINT STATUS TIMELINE */}
              <StatusTimeline complaint={item} language={language} />


              {/* MUNICIPALITY RESOLUTION PROOF FOR CITIZEN */}
              {status === "Resolved" && (
                <div
                  style={{
                    marginTop: "18px",
                    padding: "16px",
                    background: "linear-gradient(145deg, #064e3b, #0f172a)",
                    borderRadius: "12px",
                    border: "1px solid #10b981",
                    color: "#fff"
                  }}
                >
                  <h4 style={{ margin: "0 0 10px", color: "#34d399", display: "flex", alignItems: "center", gap: "8px" }}>
                    🏆 Municipality Resolution Proof
                  </h4>

                  <div style={{ marginBottom: "8px", fontSize: "14px" }}>
                    <b>Title:</b> {item.resolution_title || "Public Infrastructure Issue Resolved"}
                  </div>

                  {item.description && (
                    <div style={{ marginBottom: "8px", fontSize: "13px", color: "#cbd5e1" }}>
                      <b>Original Problem:</b> {item.description}
                    </div>
                  )}

                  <div style={{ marginBottom: "8px", fontSize: "14px" }}>
                    <b>Action Taken:</b> {item.resolution_description || "Municipality maintenance team inspected, repaired, and verified the issue."}
                  </div>

                  {item.resolution_date && (
                    <div style={{ marginBottom: "12px", fontSize: "12px", color: "#94a3b8" }}>
                      📅 <b>Resolution Date:</b> {item.resolution_date}
                    </div>
                  )}

                  {item.resolution_image && (
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "6px", color: "#34d399" }}>
                        🖼️ Resolution Proof Photo:
                      </div>
                      <img
                        src={item.resolution_image}
                        alt="Resolution Proof"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "220px",
                          borderRadius: "10px",
                          border: "2px solid #10b981",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* CITIZEN REMOVE BUTTON (ONLY AVAILABLE WHEN RESOLVED) */}
              {!canChangeStatus && status === "Resolved" && (
                <div style={{ marginTop: "15px", textAlign: "right" }}>
                  <button
                    onClick={() => setConfirmModalItem(item)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <FaTrash /> {kannada ? "ಇತಿಹಾಸದಿಂದ ತೆಗೆದುಹಾಕಿ" : "Remove from History"}
                  </button>
                </div>
              )}

              {/* CITIZEN MESSAGE */}
              {!canChangeStatus && status !== "Resolved" && (

                <div
                  style={{
                    marginTop: "15px",
                    padding: "12px",
                    background: "#0f172a",
                    borderRadius: "10px",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "14px"
                  }}
                >

                  🔒 Status can be updated
                  only by authorized officials.

                </div>

              )}

            </div>

          );

        })

      )}

      {/* CONFIRMATION DIALOG FOR CITIZEN REMOVE */}
      {confirmModalItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000
          }}
        >
          <div
            style={{
              background: "#1e293b",
              border: "2px solid #ef4444",
              padding: "25px",
              borderRadius: "16px",
              maxWidth: "450px",
              width: "90%",
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}
          >
            <h3 style={{ margin: "0 0 12px", color: "#ef4444" }}>
              ⚠️ {kannada ? "ಪೂರ್ಣಗೊಂಡ ದೂರನ್ನು ತೆಗೆದುಹಾಕಿ" : "Remove Completed Complaint"}
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
              {kannada
                ? "ನಿಮ್ಮ ಇತಿಹಾಸದಿಂದ ಈ ಪೂರ್ಣಗೊಂಡ ದೂರನ್ನು ತೆಗೆದುಹಾಕಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?"
                : "Are you sure you want to remove this completed complaint from your history?"}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={() => setConfirmModalItem(null)}
                style={{
                  background: "#475569",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {kannada ? "ರದ್ದುಮಾಡಿ" : "Cancel"}
              </button>

              <button
                onClick={() => handleCitizenRemove(confirmModalItem)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {kannada ? "ತೆಗೆದುಹಾಕಿ" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );

}


export default History;
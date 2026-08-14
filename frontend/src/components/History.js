import React from "react";

import {
  FaTrash,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaMapMarkerAlt
} from "react-icons/fa";


function History({
  history,
  clearHistory,
  updateStatus,
  userRole,
  onViewMap
}) {

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

        history.map((item, index) => {

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


              {/* STATUS FLOW */}

              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "15px",
                  borderTop:
                    "1px solid #475569",
                  textAlign: "center",
                  color: "#94a3b8"
                }}
              >

                🟡 Pending

                {"  →  "}

                🔵 In Progress

                {"  →  "}

                🟢 Resolved

              </div>


              {/* CITIZEN MESSAGE */}

              {!canChangeStatus && (

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

    </div>

  );

}


export default History;
import React from "react";
import { FaCheckCircle, FaHourglassHalf, FaTools } from "react-icons/fa";

function StatusTimeline({ complaint, language }) {
  if (!complaint) return null;

  const kannada = language === "Kannada";
  const currentStatus = (complaint.status || "Pending").trim();

  // Status progression states:
  // 1. Submitted: Always done
  // 2. Reviewing: Done if Pending, In Progress, or Resolved
  // 3. Work In Progress: Done if Resolved; Active if In Progress
  // 4. Problem Resolved: Done & Active if Resolved

  const isSubmitted = true;
  const isReviewing = ["Pending", "In Progress", "Resolved"].includes(currentStatus);
  const isInProgress = ["In Progress", "Resolved"].includes(currentStatus);
  const isResolved = currentStatus === "Resolved";
  const isRejected = currentStatus === "Rejected";

  const steps = [
    {
      id: 1,
      label: kannada ? "ದೂರು ಸಲ್ಲಿಸಲಾಗಿದೆ" : "Complaint Submitted",
      icon: "🟢",
      activeIcon: <FaCheckCircle color="#10b981" />,
      time: complaint.time || "",
      isDone: isSubmitted,
      isCurrent: false,
      color: "#10b981"
    },
    {
      id: 2,
      label: kannada ? "ಮಹಾನಗರ ಪರಿಶೀಲಿಸುತ್ತಿದೆ" : "Municipality Reviewing",
      icon: "🟡",
      activeIcon: <FaHourglassHalf color="#f59e0b" />,
      time: isReviewing ? (complaint.time || "") : "",
      isDone: isReviewing,
      isCurrent: currentStatus === "Pending",
      color: "#f59e0b"
    },
    {
      id: 3,
      label: kannada ? "ಕಾಮಗಾರಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ" : "Work In Progress",
      icon: "🔵",
      activeIcon: <FaTools color="#3b82f6" />,
      time: complaint.in_progress_time || "",
      isDone: isInProgress,
      isCurrent: currentStatus === "In Progress",
      color: "#3b82f6"
    },
    {
      id: 4,
      label: kannada ? "ಸಮಸ್ಯೆ ಪರಿಹರಿಸಲಾಗಿದೆ" : "Problem Resolved",
      icon: "🟢",
      activeIcon: <FaCheckCircle color="#10b981" />,
      time: complaint.resolution_date || complaint.resolved_time || "",
      isDone: isResolved,
      isCurrent: isResolved,
      color: "#10b981"
    }
  ];

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "16px 20px",
        borderRadius: "14px",
        border: "1px solid #334155",
        margin: "15px 0"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          borderBottom: "1px solid #1e293b",
          paddingBottom: "8px"
        }}
      >
        <h4 style={{ margin: 0, color: "#38bdf8", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          ⏱️ {kannada ? "ದೂರು ಸ್ಥಿತಿ ವೇಳಾಪಟ್ಟಿ" : "Complaint Status Timeline"}
        </h4>
        {isRejected && (
          <span
            style={{
              background: "#ef4444",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold"
            }}
          >
            ❌ {kannada ? "ನಿರಾಕರಿಸಲಾಗಿದೆ" : "REJECTED"}
          </span>
        )}
      </div>

      {/* HORIZONTAL TIMELINE STEPPER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative"
        }}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const nextStep = steps[index + 1];
          const lineCompleted = nextStep && nextStep.isDone;

          return (
            <div
              key={step.id}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                textAlign: "center"
              }}
            >
              {/* CONNECTING LINE TO NEXT STEP */}
              {!isLast && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "50%",
                    width: "100%",
                    height: "3px",
                    background: lineCompleted ? "#10b981" : "#334155",
                    zIndex: 1,
                    transition: "0.3s"
                  }}
                />
              )}

              {/* STEP CIRCLE / BADGE */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: step.isDone
                    ? step.color
                    : "#1e293b",
                  border: step.isCurrent
                    ? `3px solid ${step.color}`
                    : "2px solid #334155",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "14px",
                  zIndex: 2,
                  boxShadow: step.isCurrent ? `0 0 10px ${step.color}` : "none",
                  transition: "0.3s"
                }}
              >
                {step.isDone ? (
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>{step.icon}</span>
                ) : (
                  <span style={{ color: "#64748b", fontSize: "12px" }}>{step.id}</span>
                )}
              </div>

              {/* STEP LABEL */}
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  fontWeight: step.isDone || step.isCurrent ? "bold" : "normal",
                  color: step.isDone
                    ? "#f8fafc"
                    : step.isCurrent
                    ? step.color
                    : "#64748b",
                  maxWidth: "110px",
                  lineHeight: "1.3"
                }}
              >
                {step.label}
              </div>

              {/* STEP TIMESTAMP */}
              {step.time ? (
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "10px",
                    color: "#94a3b8",
                    background: "#1e293b",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    border: "1px solid #334155"
                  }}
                >
                  📅 {step.time}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusTimeline;

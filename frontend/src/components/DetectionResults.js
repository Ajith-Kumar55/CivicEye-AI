import React from "react";

function DetectionResults({
  results,
  originalImage,
  predictionImage,
}) {
  return (
    <div
      style={{
  background: "linear-gradient(180deg,#1e293b,#334155)",
  color: "white",
  padding: "35px",
  borderRadius: "22px",
  marginBottom: "35px",
  boxShadow: "0 12px 30px rgba(0,0,0,.30)"
}}
    >
      <h2
        style={{
  textAlign: "center",
  color: "#38bdf8",
  marginBottom: "30px",
  fontSize: "34px",
  fontWeight: "700"
}}
      >
        AI Detection Report
      </h2>

      {results.length === 0 ? (
        <p>No detections available.</p>
      ) : (
        results.map((item, index) => (
          <div key={index}>
            {/* Images */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                flexWrap: "wrap",
                marginBottom: "30px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h3>Original Image</h3>

                {originalImage && (
                  <img
                    src={originalImage}
                    alt="Original"
                    style={{
                      width:"380px",
height:"260px",
objectFit:"cover",
borderRadius:"18px",
border:"3px solid #475569",
boxShadow:"0 10px 25px rgba(0,0,0,.25)",
                    }}
                  />
                )}
              </div>

              <div style={{ textAlign: "center" }}>
                <h3>AI Detection</h3>

                {predictionImage && (
                  <img
                    src={predictionImage}
                    alt="Prediction"
                    style={{
                      width:"380px",
height:"260px",
objectFit:"cover",
borderRadius:"18px",
border:"3px solid #06b6d4",
boxShadow:"0 10px 25px rgba(0,0,0,.25)",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Report */}

            <div
             style={{
  background:"#475569",
  padding:"25px",
  borderRadius:"18px",
  marginTop:"20px"
}}
            >
              <h2
  style={{
    color: "#38bdf8",
    fontSize: "32px",
    marginBottom: "20px",
    fontWeight: "700"
  }}
>
  🛣️ {item.issue}
</h2>
              <p>
                <strong>Confidence:</strong>{" "}
                {item.confidence}%
              </p>

              {/* Progress Bar */}

              <div
               style={{
  width: "100%",
  height: "18px",
  background: "#1e293b",
  borderRadius: "20px",
  overflow: "hidden",
  marginBottom: "25px",
}}
              >
                <div
                  style={{
                    width: `${item.confidence}%`,
                    height: "100%",
                    background: "#06b6d4",
                  }}
                />
              </div>

              <p>
                <strong>Severity:</strong>{" "}
                <span
                  style={{
                    background:
                      item.severity === "HIGH"
                        ? "#ef4444"
                        : item.severity === "MEDIUM"
                        ? "#f59e0b"
                        : "#22c55e",
                    padding: "6px 12px",
                    borderRadius: "8px",
                  }}
                >
                  {item.severity}
                </span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    background: "#0ea5e9",
                    padding: "6px 12px",
                    borderRadius: "8px",
                  }}
                >
                  {item.status}
                </span>
              </p>

              <p>
                <strong>Date:</strong> {item.time}
              </p>

              <p>
                <strong>Report ID:</strong>{" "}
                #{1000 + index}
              </p>

              <button
                style={{
  marginTop: "20px",
  background: "#06b6d4",
  color: "white",
  border: "none",
  padding: "15px 30px",
  borderRadius: "12px",
  fontSize: "17px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(6,182,212,.30)",
  transition: ".3s"
}}
              >
                Download Report
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DetectionResults;
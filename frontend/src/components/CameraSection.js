import React, { useRef, useState } from "react";

function CameraSection({ onDetection }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      alert("Unable to access camera.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    setCameraOn(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      try {
        const response = await fetch("http://127.0.0.1:5000/detect", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.detections) {
          onDetection(data.detections);
        }
      } catch (err) {
        alert("Detection failed.");
      }
    }, "image/jpeg");
  };

  return (
    <div
      style={{
        background: "#1e293b",
        color: "white",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "25px",
      }}
    >
      <h2>Live Camera Detection</h2>

      <button
        onClick={startCamera}
        style={{
          marginRight: "10px",
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
        }}
      >
        Start Camera
      </button>

      <button
        onClick={stopCamera}
        style={{
          marginRight: "10px",
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          background: "#dc2626",
          color: "white",
        }}
      >
        Stop Camera
      </button>

      <button
        onClick={captureImage}
        disabled={!cameraOn}
        style={{
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          background: "#16a34a",
          color: "white",
        }}
      >
        Capture & Detect
      </button>

      <br />
      <br />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="550"
        style={{
          borderRadius: "10px",
          border: "2px solid #0ea5e9",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default CameraSection;
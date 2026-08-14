# CivicEye AI 🚨

## AI-Based Smart Public Issue Detection & Resolution System

CivicEye AI is an AI-powered smart city application designed to help citizens report and track public infrastructure issues such as garbage, potholes, and water leakage.

The system analyzes uploaded images, identifies the type of public issue, provides a confidence score and severity level, and maintains complaint history for tracking and management.

---

## 🎯 Problem Statement

Public issues such as garbage accumulation, potholes, and water leakage are often reported through informal channels. This can make it difficult for authorities to identify, prioritize, and track complaints efficiently.

CivicEye AI provides a centralized digital platform for detecting and reporting these issues.

---

## 💡 Proposed Solution

The system combines a React frontend, Flask backend, and AI-based image detection to provide:

- 📷 Image-based issue detection
- 🤖 AI-powered classification
- 📊 Confidence and severity information
- 📍 Location-based complaint information
- 📝 Complaint history
- 📈 Analytics dashboard
- 📹 Live camera support
- 🗺️ Google Maps integration
- 📄 PDF report generation
- 🔄 Complaint status tracking

---

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML
- CSS
- Axios

### Backend

- Python
- Flask
- Flask-CORS

### Artificial Intelligence

- YOLO-based models
- TensorFlow
- OpenCV
- Image processing

### Other Technologies

- Google Maps
- Git
- GitHub

---

## ✨ Main Features

### 1. Image Upload

Citizens can upload an image of a public issue for AI analysis.

### 2. AI Detection

The system analyzes the image and identifies supported public issues.

### 3. Confidence Score

The detection result includes a confidence percentage.

### 4. Severity Analysis

Issues can be categorized based on their severity.

### 5. Complaint Management

Detected issues can be recorded as complaints.

### 6. Complaint History

Citizens can view previously submitted complaints and their current status.

### 7. Analytics Dashboard

The dashboard provides visual statistics about detected issues.

### 8. Live Camera

Users can capture an image directly using the device camera.

### 9. Location Support

The system provides location-related functionality through Google Maps.

### 10. PDF Reports

Detection information can be generated as a PDF report.

---

## 🤖 AI Detection

CivicEye AI is designed to identify public issues including:

| Issue | Example |
|---|---|
| 🗑️ Garbage | Garbage accumulation in public areas |
| 🕳️ Pothole | Road potholes and road damage |
| 💧 Water Leakage | Visible water leakage |

The system displays the detected issue together with a confidence score and severity information.

---

## 📂 Project Structure

```text
CivicEye-AI/
│
├── backend/
│   ├── app.py
│   ├── best.pt
│   ├── garbage.pt
│   ├── pothole.pt
│   └── yolov8n.pt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── images.txt
├── labels.txt
└── yolov8n.pt

---

## 🚀 How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/Ajith-Kumar55/CivicEye-AI.git
cd CivicEye-AI
```

### 2. Backend Setup

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the environment on Windows:

```bash
venv\Scripts\activate
```

Install the required Python packages used by the backend.

Start the Flask backend:

```bash
python backend/app.py
```

The backend will run on the Flask port configured in `backend/app.py`.

### 3. Frontend Setup

Open a **new terminal** and navigate to the frontend:

```bash
cd frontend
```

Install the required Node.js packages:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The application will open in your browser.

---

## ⚠️ AI Model Files

Some AI model files are large and may not be included in the GitHub repository.

For example:

```text
backend/model.h5
```

is excluded through `.gitignore`.

If the backend requires this model, the required model file must be available locally.

---

## 📊 Dashboard

CivicEye AI provides an analytics dashboard for viewing information related to detected public issues and complaints.

The dashboard can be used to visualize issue statistics and monitor complaint information.

---

## 🔄 Complaint Tracking

The system provides complaint management functionality that allows users to:

- Submit detected public issues as complaints
- View complaint history
- Track complaint status
- Review previously detected issues
- Manage issue-related information

---

## 📍 Location & Maps

The application includes location-related functionality using Google Maps.

This can help associate reported public issues with their geographic location and support location-based complaint management.

---

## 📷 Live Camera

CivicEye AI provides a live camera feature that allows users to capture an image directly from a supported device.

The captured image can then be processed for AI-based public issue detection.

---

## 📄 PDF Reports

Detection information can be used to generate PDF reports containing relevant issue and detection information.

This can help users maintain a record of detected public issues.

---

## 🧠 AI Detection

The system uses AI-based image detection to identify supported public infrastructure issues.

Current supported issue categories include:

- 🗑️ Garbage
- 🕳️ Pothole
- 💧 Water Leakage

The detection system provides a confidence score for the identified issue.

---

## 🔐 System Workflow

```text
Citizen
   │
   ▼
React Frontend
   │
   ├── Upload Image
   ├── Live Camera
   ├── Complaint
   ├── History
   ├── Analytics
   └── Google Maps
   │
   ▼
Flask Backend
   │
   ▼
AI Image Detection
   │
   ├── Garbage
   ├── Pothole
   └── Water Leakage
   │
   ▼
Detection Result
   │
   ├── Issue Type
   ├── Confidence Score
   └── Severity Information
   │
   ▼
Complaint / Tracking
```

---

## 🔮 Future Enhancements

- 📱 Android/iOS mobile application
- ☁️ Cloud deployment
- 🗄️ Production database
- 🔔 Real-time notifications
- 👮 Authority/admin dashboard
- 🧠 Improved AI detection accuracy
- 🗺️ Real-time issue mapping
- 📍 Automatic GPS-based complaint location
- 📈 Advanced predictive analytics
- 🔐 Advanced authentication and authorization
- 🌐 Scalable cloud infrastructure

---

## 🎓 Project Type

**Final Year Engineering Project**

**Domain:** Artificial Intelligence / Machine Learning / Smart City / Computer Vision

---

## 👨‍💻 Developer

**Ajith Kumar HM**

GitHub: [Ajith-Kumar55](https://github.com/Ajith-Kumar55)

---

## 📄 License

This project is developed for educational and project demonstration purposes.


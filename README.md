# CivicEye-AI 🏙️
### AI-Based Smart Public Issue Detection & Resolution System

CivicEye-AI is an AI-powered smart-city complaint management platform designed to help citizens report public infrastructure problems and help municipality authorities manage, update, and resolve those complaints efficiently.

The system uses AI-based image detection to identify common public issues such as **Potholes, Garbage, and Water Leakage**, while providing a complete complaint lifecycle from submission to resolution.

---

## 🚀 Project Overview

In many cities, citizens face problems such as:

- Road potholes
- Garbage accumulation
- Water leakage
- Delayed complaint response
- Lack of complaint tracking
- Poor communication between citizens and authorities

CivicEye-AI provides a digital platform where citizens can submit complaints using images and track their status, while municipality administrators can manage complaints, update their status, and publish completed-resolution posts.

---

## 🎯 Objectives

- Detect common public issues using AI.
- Allow citizens to submit complaints digitally.
- Reduce manual complaint reporting.
- Provide complaint status tracking.
- Help municipality authorities manage complaints efficiently.
- Maintain complaint history.
- Provide transparency between citizens and authorities.
- Allow authorities to showcase resolved public issues.
- Create a centralized smart-city complaint management system.

---

# ✨ Key Features

## 👤 Citizen/User Features

### 🔐 User Authentication
- User registration and login.
- Secure user-based access.
- User-specific complaint information.

### 📸 AI-Based Issue Detection
Citizens can upload an image of a public issue.

The system currently supports:

- 🕳️ **Pothole Detection**
- 🗑️ **Garbage Detection**
- 💧 **Water Leakage Detection**

The AI provides detection information such as:

- Detected issue
- Confidence percentage
- Severity
- Detection image

### 📝 Complaint Submission

After detecting an issue, the citizen can submit a complaint containing the relevant issue information.

### 📋 Complaint History

Users can view their previously submitted complaints and monitor their progress.

### 📊 Complaint Status Tracking

Complaints can move through different stages based on municipality actions.

The system provides status information and a timeline so citizens can understand the progress of their complaint.

### 🗑️ Complaint History Management

Completed complaint records can be managed according to the application's implemented history functionality.

---

# 🏛️ Municipality Admin Features

## 🔐 Municipality Admin Login

A dedicated municipality administration interface allows authorized administrators to manage citizen complaints.

## 📊 Admin Dashboard

The municipality dashboard provides an overview of complaints and their current status.

## 📋 Complaint Management

Administrators can:

- View submitted complaints
- Review issue details
- View complaint information
- Monitor complaint status
- Manage complaint records

## 🔄 Complaint Status Updates

Municipality administrators can update complaints as work progresses.

This allows citizens to see whether their reported problem is being handled.

## ✅ Problem Resolution

Administrators can mark public issues as resolved after completing the required work.

Resolved complaints can be maintained as completed records.

## 🗑️ Admin History Management

Administrators can manage solved/problem history according to the implemented system functionality.

---

# 📢 Resolution Feed / Social Features

CivicEye-AI also provides a social-style resolution feed.

Municipality administrators can publish posts showing successfully resolved public problems.

### Resolution Posts

An administrator can:

- Upload an image of a resolved problem
- Add information about the completed work
- Publish the resolution
- Allow citizens to view completed work

### ❤️ Likes

Citizens can interact with resolution posts using the implemented like functionality.

This provides a simple social interaction layer and helps demonstrate municipality work to citizens.

---

# ⏱️ Status Timeline

The system provides a complaint status timeline so users can understand the progression of their complaint.

Example workflow:

```text
Complaint Submitted
        ↓
Complaint Reviewed
        ↓
Work in Progress
        ↓
Problem Resolved
        ↓
Completed
```

The exact status flow is controlled by the application's implemented municipality functionality.

---

# 🤖 AI Detection Workflow

The current AI workflow is:

```text
Citizen Uploads Image
        ↓
Image Sent to Backend
        ↓
AI Model Processes Image
        ↓
Issue Detection
        ↓
Confidence Calculation
        ↓
Severity Information
        ↓
Detection Result
        ↓
Complaint Submission
        ↓
Municipality Management
```

### Supported AI Categories

| Category | Supported |
|---|---|
| Pothole | ✅ |
| Garbage | ✅ |
| Water Leakage | ✅ |

---

# 🏗️ System Architecture

```text
                    CIVICEYE-AI
                         │
             ┌───────────┴───────────┐
             │                       │
          Citizen              Municipality
             │                    Admin
             │                       │
             ▼                       ▼
       React Frontend          Admin Dashboard
             │                       │
             └───────────┬───────────┘
                         │
                         ▼
                    Flask Backend
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
             AI       Database    APIs
           Model
              │
              ▼
     Pothole / Garbage /
       Water Leakage
```

---

# 🛠️ Technology Stack

## Frontend

- React.js
- JavaScript
- HTML
- CSS
- React Components

## Backend

- Python
- Flask
- Flask APIs

## Artificial Intelligence

- YOLO-based object detection
- AI image classification/detection
- Confidence-based detection

## Database

- SQLite

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Python Virtual Environment
- Node.js / npm

---

# 📁 Project Structure

```text
CivicEye-AI/
│
├── backend/
│   ├── app.py
│   ├── model/
│   ├── uploads/
│   ├── predictions/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MunicipalityAdmin/
│   │   │   ├── Complaint.js
│   │   │   ├── History.js
│   │   │   ├── Login.js
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   ├── ResolutionFeed.jsx
│   │   │   └── StatusTimeline.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── README.md
└── ...
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Ajith-Kumar55/CivicEye-AI.git
```

Then:

```bash
cd CivicEye-AI
```

---

# 🐍 Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create/activate the Python virtual environment.

On Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required Python packages if they are listed in the project's requirements file:

```bash
pip install -r requirements.txt
```

Run the Flask backend:

```bash
py -3.10 app.py
```

The backend runs at:

```text
http://127.0.0.1:5000
```

---

# ⚛️ Frontend Setup

Open another terminal.

Go to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend normally runs at:

```text
http://localhost:3000
```

---

# 🔄 Running the Complete System

Start the backend first:

```bash
cd backend
py -3.10 app.py
```

Then start the frontend in another terminal:

```bash
cd frontend
npm start
```

Open the application in your browser.

---

# 👥 User Workflow

```text
1. User Registration/Login
          ↓
2. Upload Public Issue Image
          ↓
3. AI Detection
          ↓
4. View Detection Result
          ↓
5. Submit Complaint
          ↓
6. Complaint Stored
          ↓
7. Municipality Reviews Complaint
          ↓
8. Status Updated
          ↓
9. Problem Resolved
          ↓
10. User Views Completed Complaint
```

---

# 🏛️ Municipality Workflow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
View Citizen Complaints
     ↓
Review Issue
     ↓
Update Status
     ↓
Resolve Problem
     ↓
Upload Resolution Image
     ↓
Publish Resolution Post
     ↓
Citizens View Resolution
```

---

# 🔒 Data & Access

The system separates citizen and municipality functionality.

### Citizens

Can:

- Submit complaints
- View their complaint history
- Track complaint status
- View resolution posts
- Interact with available social features

### Municipality Administrators

Can:

- Access the municipality dashboard
- View complaints
- Update complaint status
- Manage resolved complaints
- Publish resolution posts
- Manage municipality-side functionality

---

# 📈 Benefits

### For Citizens

- Easy digital complaint submission
- AI-assisted issue detection
- Complaint tracking
- Complaint history
- Better transparency

### For Municipality

- Centralized complaint management
- Faster issue identification
- Organized complaint tracking
- Status management
- Resolution documentation
- Public visibility of completed work

---

# 🌆 Smart City Impact

CivicEye-AI can contribute to smart-city administration by connecting citizens and municipal authorities through a centralized digital platform.

The system aims to improve:

- Public issue reporting
- Response tracking
- Complaint transparency
- Municipality workflow
- Citizen engagement
- Digital governance

---

# 🔮 Future Enhancements

The following are potential future improvements and are **not claimed as completed features in the current version**:

- Improved AI unknown-image rejection
- Additional AI training data
- Improved model accuracy and generalization
- More advanced location accuracy
- Enhanced Google Maps integration
- Mobile application
- Push notifications
- Advanced analytics
- Municipality performance analytics
- Multi-city deployment
- Cloud deployment
- Advanced AI severity estimation

---

# 🧪 Current AI Testing

The AI should be evaluated using both known and previously unseen images.

Recommended testing categories:

```text
Pothole
Garbage
Water Leakage
Unrelated/Unknown Images
```

Testing on previously unseen images helps evaluate how well the model generalizes beyond the training dataset.

---

# 🎓 Academic Project

**Project Title:**

> AI-Based Smart Public Issue Detection & Resolution System

**Project Name:**

> CivicEye-AI

**Project Type:**

> AI + Smart City + Web Application

The project demonstrates the integration of:

- Artificial Intelligence
- Computer Vision
- Web Development
- REST APIs
- Database Management
- User Authentication
- Municipality Administration
- Complaint Management
- Social/Community Features

---

# 📌 Project Status

### Current Version

**Working Prototype / Engineering Project**

The current system includes AI-based public issue detection, citizen complaint management, municipality administration, complaint tracking, resolution management, and a resolution social feed.

---

# 👨‍💻 Developer

**Ajith Kumar HM**

CivicEye-AI — AI-Based Smart Public Issue Detection & Resolution System

---

# 📄 License

This project is developed for educational and academic purposes.

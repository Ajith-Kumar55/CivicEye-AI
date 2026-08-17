from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
from datetime import datetime
import os
import sqlite3
import shutil

app = Flask(__name__)
CORS(app)

# =========================
# LOAD MODEL
# =========================

model = YOLO("best.pt")

# =========================
# FOLDERS & DATABASE
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
PREDICT_FOLDER = os.path.join(BASE_DIR, "predictions")
DB_PATH = os.path.join(BASE_DIR, "complaints.db")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PREDICT_FOLDER, exist_ok=True)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            issue TEXT NOT NULL DEFAULT 'No Issue Detected',
            confidence REAL NOT NULL DEFAULT 0.0,
            severity TEXT NOT NULL DEFAULT 'LOW',
            status TEXT NOT NULL DEFAULT 'Pending',
            time TEXT NOT NULL DEFAULT '',
            prediction_image TEXT DEFAULT '',
            location TEXT DEFAULT '',
            description TEXT DEFAULT '',
            department TEXT DEFAULT 'PWD & Roads'
        )
    """)
    conn.commit()

    # Check and add any missing columns if complaints table pre-existed
    cursor.execute("PRAGMA table_info(complaints)")
    existing_cols = [row[1] for row in cursor.fetchall()]

    needed_cols = {
        "issue": "TEXT NOT NULL DEFAULT 'No Issue Detected'",
        "confidence": "REAL NOT NULL DEFAULT 0.0",
        "severity": "TEXT NOT NULL DEFAULT 'LOW'",
        "status": "TEXT NOT NULL DEFAULT 'Pending'",
        "time": "TEXT NOT NULL DEFAULT ''",
        "prediction_image": "TEXT DEFAULT ''",
        "location": "TEXT DEFAULT ''",
        "description": "TEXT DEFAULT ''",
        "department": "TEXT DEFAULT 'PWD & Roads'",
        "citizen_name": "TEXT DEFAULT 'Registered Citizen'",
        "citizen_email": "TEXT DEFAULT 'citizen@civiceye.com'",
        "citizen_phone": "TEXT DEFAULT '+91 9876543210'",
        "officer_notes": "TEXT DEFAULT ''",
        "resolution_title": "TEXT DEFAULT ''",
        "resolution_description": "TEXT DEFAULT ''",
        "resolution_image": "TEXT DEFAULT ''",
        "resolution_date": "TEXT DEFAULT ''",
        "in_progress_time": "TEXT DEFAULT ''",
        "resolved_time": "TEXT DEFAULT ''",
        "is_deleted": "INTEGER DEFAULT 0",
        "deleted_at": "TEXT DEFAULT ''"
    }

    for col, col_type in needed_cols.items():
        if col not in existing_cols:
            try:
                cursor.execute(f"ALTER TABLE complaints ADD COLUMN {col} {col_type}")
            except Exception as e:
                print(f"Error adding column {col}:", e)

    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM complaints")
    count = cursor.fetchone()[0]

    if count == 0:
        sample_records = [
            ("pothole", 94.5, "HIGH", "Pending", "2026-08-17 10:15:30", "result/capture.jpg", "MG Road, Ward 12, Bengaluru", "Severe pothole near traffic junction", "PWD & Roads", "Ramesh Kumar", "ramesh.k@gmail.com", "+91 9845012345", "Dispatched PWD inspector"),
            ("garbage", 88.2, "HIGH", "In Progress", "2026-08-17 11:30:12", "result/capture.jpg", "Indiranagar 100ft Rd, Ward 45", "Garbage overflow near bus stop", "Solid Waste Mgmt", "Priya Sharma", "priya.s@gmail.com", "+91 9900112233", "Sanitation vehicle dispatched"),
            ("water leakage", 76.8, "MEDIUM", "Pending", "2026-08-17 12:45:00", "result/capture.jpg", "Koramangala 5th Block, Ward 68", "Pipeline leakage causing road flooding", "Water Supply & Sewerage", "Anand Rao", "anand.rao@gmail.com", "+91 9741234567", "Awaiting valve replacement"),
            ("pothole", 65.4, "MEDIUM", "Resolved", "2026-08-16 16:20:00", "result/capture.jpg", "Brigade Road, Ward 22", "Pothole filled and tarred", "PWD & Roads", "Suresh Nair", "suresh.n@gmail.com", "+91 9880123456", "Work completed and verified"),
            ("garbage", 82.0, "HIGH", "Pending", "2026-08-16 09:10:44", "result/capture.jpg", "Whitefield Main Rd, Ward 84", "Construction waste dumped on sidewalk", "Solid Waste Mgmt", "Deepa Mehta", "deepa.m@gmail.com", "+91 9611223344", "Notice issued to builder"),
            ("water leakage", 91.5, "HIGH", "In Progress", "2026-08-16 14:05:19", "result/capture.jpg", "Jayanagar 4th Block, Ward 52", "Main pipe leak repaired in progress", "Water Supply & Sewerage", "Karthik V", "karthik.v@gmail.com", "+91 9535667788", "Water supply isolated for repair"),
            ("No Issue Detected", 0.0, "LOW", "Resolved", "2026-08-15 18:00:00", "result/capture.jpg", "Residential Area inspection", "Regular automated scan clear", "PWD & Roads", "System Auto-Scan", "system@civiceye.com", "N/A", "Scan verified clean")
        ]

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feed_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            complaint_id INTEGER DEFAULT 0,
            admin_name TEXT NOT NULL DEFAULT 'Shimoga Municipal Corporation',
            title TEXT NOT NULL,
            issue_type TEXT DEFAULT 'Pothole',
            location TEXT NOT NULL,
            problem_description TEXT,
            resolution_description TEXT,
            resolution_image TEXT,
            resolution_date TEXT,
            likes INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM feed_posts")
    feed_count = cursor.fetchone()[0]

    if feed_count == 0:
        sample_feed = [
            (
                101,
                "Shimoga Municipal Corporation",
                "🕳️ Pothole Resolved",
                "Pothole",
                "Shimoga Ward 14, Main Road",
                "Large pothole reported by citizens.",
                "Road repair completed by municipality maintenance team.",
                "result/capture.jpg",
                "2026-08-17 14:30:00",
                24,
                "2026-08-17 14:35:00"
            ),
            (
                102,
                "BBMP Solid Waste Management",
                "🗑️ Garbage Dump Cleared",
                "Garbage",
                "Indiranagar 100ft Rd, Ward 45",
                "Commercial garbage accumulation near public transit area.",
                "Sanitation unit dispatched, garbage cleared, and area disinfected.",
                "result/capture.jpg",
                "2026-08-17 11:15:00",
                31,
                "2026-08-17 11:20:00"
            ),
            (
                103,
                "BWSSB Water Supply Board",
                "💧 Pipeline Water Leakage Repaired",
                "Water Leakage",
                "Koramangala 5th Block, Ward 68",
                "Pipeline leakage causing road flooding.",
                "Emergency engineering crew isolated line and replaced faulty pipe.",
                "result/capture.jpg",
                "2026-08-16 16:45:00",
                19,
                "2026-08-16 17:00:00"
            )
        ]
        cursor.executemany("""
            INSERT INTO feed_posts (complaint_id, admin_name, title, issue_type, location, problem_description, resolution_description, resolution_image, resolution_date, likes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_feed)
    cursor.execute("PRAGMA table_info(feed_posts)")
    existing_feed_cols = [row[1] for row in cursor.fetchall()]
    needed_feed_cols = {
        "is_deleted": "INTEGER DEFAULT 0",
        "deleted_at": "TEXT DEFAULT ''"
    }
    for col, col_type in needed_feed_cols.items():
        if col not in existing_feed_cols:
            try:
                cursor.execute(f"ALTER TABLE feed_posts ADD COLUMN {col} {col_type}")
            except Exception as e:
                print(f"Error adding feed_posts column {col}:", e)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS post_likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            user_email TEXT NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE(post_id, user_email)
        )
    """)
    conn.commit()

    conn.close()

init_db()

def save_complaint_to_db(detection_dict):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        issue = detection_dict.get("issue", "No Issue Detected")
        confidence = float(detection_dict.get("confidence", 0))
        severity = detection_dict.get("severity", "LOW")
        status = detection_dict.get("status", "Pending")
        time_str = detection_dict.get("time", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        prediction_image = str(detection_dict.get("prediction_image", ""))
        location = detection_dict.get("location", "")
        description = detection_dict.get("description", "")
        citizen_name = detection_dict.get("citizen_name", "Registered Citizen")
        citizen_email = detection_dict.get("citizen_email", "citizen@civiceye.com")
        citizen_phone = detection_dict.get("citizen_phone", "+91 9876543210")
        officer_notes = detection_dict.get("officer_notes", "")

        if "pothole" in issue.lower():
            department = "PWD & Roads"
        elif "garbage" in issue.lower():
            department = "Solid Waste Mgmt"
        elif "water" in issue.lower():
            department = "Water Supply & Sewerage"
        else:
            department = "PWD & Roads"

        cursor.execute("""
            INSERT INTO complaints (issue, confidence, severity, status, time, prediction_image, location, description, department, citizen_name, citizen_email, citizen_phone, officer_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (issue, confidence, severity, status, time_str, prediction_image, location, description, department, citizen_name, citizen_email, citizen_phone, officer_notes))

        conn.commit()
        complaint_id = cursor.lastrowid
        conn.close()
        return complaint_id
    except Exception as e:
        print("Database save error:", e)
        return None

# =========================
# HISTORY
# =========================

history = []

# =========================
# HOME
# =========================

@app.route("/")
def home():
    return "CivicEye AI Backend Running"


# =========================
# DETECT
# =========================

@app.route("/detect", methods=["POST"])
def detect():
    try:
        # -------------------------
        # CHECK IMAGE
        # -------------------------
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # -------------------------
        # SAVE UPLOADED IMAGE
        # -------------------------
        filename = os.path.basename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # -------------------------
        # RUN YOLO
        # IMPORTANT: DO NOT AUTO-SAVE
        # YOLO result image
        # -------------------------
        results = model.predict(
            source=filepath,
            save=False,
            conf=0.60,
            verbose=False
        )

        detections = []
        valid_results = []

        # -------------------------
        # CHECK DETECTIONS
        # -------------------------
        for result in results:

            image_height, image_width = result.orig_shape

            for box in result.boxes:

                class_id = int(box.cls[0])
                confidence = round(float(box.conf[0]) * 100, 2)

                issue = str(
                    model.names[class_id]
                ).strip()

                issue_lower = issue.lower()

                # -------------------------
                # BOUNDING BOX
                # -------------------------
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                box_width = max(0, x2 - x1)
                box_height = max(0, y2 - y1)

                image_area = image_width * image_height
                box_area = box_width * box_height

                area_ratio = (
                    box_area / image_area
                    if image_area > 0
                    else 0
                )

                width_ratio = (
                    box_width / image_width
                    if image_width > 0
                    else 0
                )

                height_ratio = (
                    box_height / image_height
                    if image_height > 0
                    else 0
                )

                # -------------------------
                # FALSE POSITIVE FILTER
                # -------------------------
                suspicious_detection = False

                # Reject extremely large boxes
                if area_ratio >= 0.75:
                    suspicious_detection = True

                # Reject the known false
                # water-leakage/person detection
                if "water" in issue_lower:

                    if (
                        area_ratio >= 0.50
                        and height_ratio >= 0.88
                    ):
                        suspicious_detection = True

                    if height_ratio >= 0.97:
                        suspicious_detection = True

                # Reject extremely large
                # pothole / garbage boxes
                if (
                    "pothole" in issue_lower
                    or "garbage" in issue_lower
                ):

                    if (
                        area_ratio >= 0.70
                        and height_ratio >= 0.90
                    ):
                        suspicious_detection = True

                # -------------------------
                # REJECT FALSE DETECTION
                # -------------------------
                if suspicious_detection:

                    print(
                        "Rejected suspicious detection:",
                        issue,
                        f"{confidence}%",
                        f"area={area_ratio:.2f}",
                        f"width={width_ratio:.2f}",
                        f"height={height_ratio:.2f}"
                    )

                    continue

                # -------------------------
                # SEVERITY
                # -------------------------
                if confidence >= 80:
                    severity = "HIGH"
                elif confidence >= 50:
                    severity = "MEDIUM"
                else:
                    severity = "LOW"

                # -------------------------
                # CREATE DETECTION
                # -------------------------
                detection = {
                    "issue": issue,
                    "confidence": confidence,
                    "severity": severity,
                    "status": "Pending",
                    "time": datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),
                    "prediction_image": ""
                }

                detections.append(detection)

                if result not in valid_results:
                    valid_results.append(result)

        # -------------------------
        # CREATE PREDICTION FOLDER
        # -------------------------
        prediction_folder = os.path.join(
            PREDICT_FOLDER,
            "result"
        )

        os.makedirs(
            prediction_folder,
            exist_ok=True
        )

        # -------------------------
        # VALID DETECTION FOUND
        # -------------------------
        if detections:

            prediction_image = (
                f"prediction_"
                f"{int(datetime.now().timestamp() * 1000)}_"
                f"{os.path.basename(filepath)}"
            )

            prediction_path = os.path.join(
                prediction_folder,
                prediction_image
            )

            # Save YOLO annotated image
            valid_result = valid_results[0]

            valid_result.save(
                filename=prediction_path
            )

            # Attach image name
            for detection in detections:

                detection["prediction_image"] = (
                    prediction_image
                )

        # -------------------------
        # NO VALID DETECTION
        # -------------------------
        else:

            prediction_image = (
                f"original_"
                f"{int(datetime.now().timestamp() * 1000)}_"
                f"{os.path.basename(filepath)}"
            )

            original_prediction_path = os.path.join(
                prediction_folder,
                prediction_image
            )

            # IMPORTANT:
            # Copy ORIGINAL image.
            # No YOLO box.
            # No wrong label.
            shutil.copy2(
                filepath,
                original_prediction_path
            )

            # Create clean No Issue record
            detection = {
                "issue": "No Issue Detected",
                "confidence": 0,
                "severity": "LOW",
                "status": "Pending",
                "time": datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                ),
                "prediction_image": prediction_image
            }

            detections.append(detection)

        # -------------------------
        # SAVE HISTORY
        # -------------------------
        strongest_detection = max(
            detections,
            key=lambda x: x["confidence"]
        )

        history.append(
            strongest_detection
        )

        save_complaint_to_db(
            strongest_detection
        )

        # -------------------------
        # PREDICTION URL
        # -------------------------
        prediction_url = (
            f"http://127.0.0.1:5000/prediction/"
            f"{prediction_image}"
        )

        # -------------------------
        # SEND RESPONSE
        # -------------------------
        return jsonify({
            "detections": detections,
            "prediction_image": prediction_url
        }), 200

    except Exception as e:

        print(
            "Detection error:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500

# =========================
# SERVE PREDICTION IMAGE
# =========================

@app.route("/prediction/<filename>")
def prediction(filename):

    return send_from_directory(

        os.path.join(
            PREDICT_FOLDER,
            "result"
        ),

        filename
    )


# =========================
# HISTORY (DB CONNECTED)
# =========================

@app.route("/history")
def get_history():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM complaints WHERE is_deleted = 0 ORDER BY id DESC LIMIT 20")
        rows = cursor.fetchall()
        conn.close()

        result_list = []
        for r in rows:
            keys = r.keys()
            result_list.append({
                "id": r["id"],
                "issue": r["issue"],
                "confidence": r["confidence"],
                "severity": r["severity"],
                "status": r["status"],
                "time": r["time"],
                "prediction_image": r["prediction_image"],
                "location": r["location"],
                "description": r["description"],
                "department": r["department"],
                "resolution_title": r["resolution_title"] if "resolution_title" in keys and r["resolution_title"] else "",
                "resolution_description": r["resolution_description"] if "resolution_description" in keys and r["resolution_description"] else "",
                "resolution_image": r["resolution_image"] if "resolution_image" in keys and r["resolution_image"] else "",
                "resolution_date": r["resolution_date"] if "resolution_date" in keys and r["resolution_date"] else "",
                "in_progress_time": r["in_progress_time"] if "in_progress_time" in keys and r["in_progress_time"] else "",
                "resolved_time": r["resolved_time"] if "resolved_time" in keys and r["resolved_time"] else ""
            })
        return jsonify(result_list)
    except Exception as e:
        return jsonify(history[-20:])


# =========================
# AUTHENTICATION & MUNICIPALITY ADMIN
# =========================

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@civiceye.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
ADMIN_TOKEN = "civiceye-admin-secret-token-2026"

@app.route("/api/login", methods=["POST"])
def api_login():
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        role = data.get("role", "citizen")

        if role == "admin" or email == ADMIN_EMAIL:
            if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
                return jsonify({
                    "success": True,
                    "role": "admin",
                    "token": ADMIN_TOKEN,
                    "user": {
                        "name": "Municipality Administrator",
                        "email": ADMIN_EMAIL
                    }
                }), 200
            else:
                return jsonify({
                    "success": False,
                    "error": "Invalid Municipality Admin credentials"
                }), 401
        
        return jsonify({
            "success": True,
            "role": "citizen",
            "token": "citizen-session-token",
            "user": {
                "name": email.split("@")[0] if email else "Citizen",
                "email": email
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/admin/verify", methods=["GET", "POST"])
def api_admin_verify():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip()
    
    if token == ADMIN_TOKEN:
        return jsonify({
            "valid": True,
            "role": "admin",
            "message": "Authorized Municipality Admin access"
        }), 200
    
    return jsonify({
        "valid": False,
        "error": "Access Denied: Citizens cannot access Admin endpoints"
    }), 403


# =========================
# REAL DATABASE ADMIN STATS & COMPLAINTS
# =========================

@app.route("/api/admin/stats", methods=["GET"])
def get_admin_stats():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM complaints")
        rows = cursor.fetchall()
        conn.close()

        total = len(rows)
        pending = 0
        in_progress = 0
        resolved = 0
        high_severity = 0

        issue_counts = {
            "Garbage": 0,
            "Pothole": 0,
            "Water Leakage": 0,
            "No Issue Detected": 0
        }

        status_counts = {
            "Pending": 0,
            "In Progress": 0,
            "Resolved": 0
        }

        for r in rows:
            st = r["status"] if r["status"] else "Pending"
            sev = r["severity"] if r["severity"] else "LOW"
            raw_iss = r["issue"] if r["issue"] else "No Issue Detected"
            iss = str(raw_iss).lower().strip()

            if st == "In Progress":
                in_progress += 1
                status_counts["In Progress"] = status_counts.get("In Progress", 0) + 1
            elif st == "Resolved":
                resolved += 1
                status_counts["Resolved"] = status_counts.get("Resolved", 0) + 1
            else:
                pending += 1
                status_counts["Pending"] = status_counts.get("Pending", 0) + 1

            if sev == "HIGH":
                high_severity += 1

            if "garbage" in iss:
                issue_counts["Garbage"] += 1
            elif "pothole" in iss:
                issue_counts["Pothole"] += 1
            elif "water" in iss:
                issue_counts["Water Leakage"] += 1
            else:
                issue_counts["No Issue Detected"] += 1

        return jsonify({
            "total_complaints": total,
            "pending": pending,
            "in_progress": in_progress,
            "resolved": resolved,
            "high_severity": high_severity,
            "issue_counts": issue_counts,
            "status_counts": status_counts
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/uploads/<filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route("/api/admin/complaints", methods=["GET"])
def get_admin_complaints():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        show_archived = request.args.get("show_archived", "false").lower() == "true"
        if show_archived:
            cursor.execute("SELECT * FROM complaints WHERE is_deleted = 1 ORDER BY id DESC")
        else:
            cursor.execute("SELECT * FROM complaints WHERE is_deleted = 0 ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()

        complaints_list = []
        for r in rows:
            keys = r.keys()
            complaints_list.append({
                "id": r["id"],
                "issue": r["issue"],
                "confidence": r["confidence"],
                "severity": r["severity"],
                "status": r["status"],
                "time": r["time"],
                "prediction_image": r["prediction_image"],
                "location": r["location"],
                "description": r["description"],
                "department": r["department"],
                "citizen_name": r["citizen_name"] if "citizen_name" in keys and r["citizen_name"] else "Registered Citizen",
                "citizen_email": r["citizen_email"] if "citizen_email" in keys and r["citizen_email"] else "citizen@civiceye.com",
                "citizen_phone": r["citizen_phone"] if "citizen_phone" in keys and r["citizen_phone"] else "+91 9876543210",
                "officer_notes": r["officer_notes"] if "officer_notes" in keys and r["officer_notes"] else "",
                "resolution_title": r["resolution_title"] if "resolution_title" in keys and r["resolution_title"] else "",
                "resolution_description": r["resolution_description"] if "resolution_description" in keys and r["resolution_description"] else "",
                "resolution_image": r["resolution_image"] if "resolution_image" in keys and r["resolution_image"] else "",
                "resolution_date": r["resolution_date"] if "resolution_date" in keys and r["resolution_date"] else "",
                "in_progress_time": r["in_progress_time"] if "in_progress_time" in keys and r["in_progress_time"] else "",
                "resolved_time": r["resolved_time"] if "resolved_time" in keys and r["resolved_time"] else ""
            })
        return jsonify(complaints_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/admin/complaints/<int:complaint_id>", methods=["GET"])
def get_single_admin_complaint(complaint_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM complaints WHERE id = ?", (complaint_id,))
        r = cursor.fetchone()
        conn.close()

        if not r:
            return jsonify({"error": "Complaint not found"}), 404

        keys = r.keys()
        return jsonify({
            "id": r["id"],
            "issue": r["issue"],
            "confidence": r["confidence"],
            "severity": r["severity"],
            "status": r["status"],
            "time": r["time"],
            "prediction_image": r["prediction_image"],
            "location": r["location"],
            "description": r["description"],
            "department": r["department"],
            "citizen_name": r["citizen_name"] if "citizen_name" in keys and r["citizen_name"] else "Registered Citizen",
            "citizen_email": r["citizen_email"] if "citizen_email" in keys and r["citizen_email"] else "citizen@civiceye.com",
            "citizen_phone": r["citizen_phone"] if "citizen_phone" in keys and r["citizen_phone"] else "+91 9876543210",
            "officer_notes": r["officer_notes"] if "officer_notes" in keys and r["officer_notes"] else "",
            "resolution_title": r["resolution_title"] if "resolution_title" in keys and r["resolution_title"] else "",
            "resolution_description": r["resolution_description"] if "resolution_description" in keys and r["resolution_description"] else "",
            "resolution_image": r["resolution_image"] if "resolution_image" in keys and r["resolution_image"] else "",
            "resolution_date": r["resolution_date"] if "resolution_date" in keys and r["resolution_date"] else "",
            "in_progress_time": r["in_progress_time"] if "in_progress_time" in keys and r["in_progress_time"] else "",
            "resolved_time": r["resolved_time"] if "resolved_time" in keys and r["resolved_time"] else ""
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/admin/complaints/<int:complaint_id>/resolve", methods=["POST"])
def resolve_admin_complaint(complaint_id):
    try:
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()

        if token != ADMIN_TOKEN:
            return jsonify({
                "success": False,
                "error": "Access Denied: Only Municipality Admin can upload resolution proof"
            }), 403

        title = request.form.get("resolution_title") or (request.json.get("resolution_title", "Issue Resolved") if request.is_json else "Issue Resolved")
        description = request.form.get("resolution_description") or (request.json.get("resolution_description", "") if request.is_json else "")
        resolution_image_url = ""

        if "resolution_image" in request.files:
            file = request.files["resolution_image"]
            if file and file.filename != "":
                filename = f"resolution_{complaint_id}_{file.filename}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                resolution_image_url = f"http://127.0.0.1:5000/uploads/{filename}"

        resolution_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE complaints
            SET status = 'Resolved',
                resolution_title = ?,
                resolution_description = ?,
                resolution_image = CASE WHEN ? != '' THEN ? ELSE resolution_image END,
                resolution_date = ?,
                resolved_time = CASE WHEN resolved_time IS NULL OR resolved_time = '' THEN ? ELSE resolved_time END
            WHERE id = ?
        """, (title, description, resolution_image_url, resolution_image_url, resolution_date, resolution_date, complaint_id))

        # Also auto-publish to feed_posts table
        cursor.execute("SELECT issue, location, description FROM complaints WHERE id = ?", (complaint_id,))
        comp = cursor.fetchone()
        issue_val = comp[0] if comp else "General Issue"
        loc_val = comp[1] if comp else "City Ward Area"
        prob_val = comp[2] if comp else "Reported public issue."

        cursor.execute("""
            INSERT INTO feed_posts (complaint_id, admin_name, title, issue_type, location, problem_description, resolution_description, resolution_image, resolution_date, likes, created_at)
            VALUES (?, 'Shimoga Municipal Corporation', ?, ?, ?, ?, ?, ?, ?, 0, ?)
        """, (complaint_id, title, issue_val, loc_val, prob_val, description, resolution_image_url, resolution_date, resolution_date))

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Complaint #{complaint_id} marked RESOLVED with resolution proof and published to Resolution Feed",
            "resolution": {
                "resolution_title": title,
                "resolution_description": description,
                "resolution_image": resolution_image_url,
                "resolution_date": resolution_date
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/feed", methods=["GET"])
def get_feed_posts():
    try:
        user_email = request.args.get("user_email", "").strip().lower()
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM feed_posts WHERE is_deleted = 0 ORDER BY id DESC")
        rows = cursor.fetchall()

        feed_list = []
        for r in rows:
            post_id = r["id"]
            
            # Query real likes count from post_likes table
            cursor.execute("SELECT COUNT(*) FROM post_likes WHERE post_id = ?", (post_id,))
            real_likes = cursor.fetchone()[0]
            
            # If no likes records yet in post_likes, use the initial seed count
            display_likes = real_likes if real_likes > 0 else (r["likes"] or 0)

            # Check if active citizen user has liked this post
            user_liked = False
            if user_email:
                cursor.execute("SELECT COUNT(*) FROM post_likes WHERE post_id = ? AND user_email = ?", (post_id, user_email))
                user_liked = cursor.fetchone()[0] > 0

            feed_list.append({
                "id": post_id,
                "complaint_id": r["complaint_id"],
                "admin_name": r["admin_name"],
                "title": r["title"],
                "issue_type": r["issue_type"],
                "location": r["location"],
                "problem_description": r["problem_description"],
                "resolution_description": r["resolution_description"],
                "resolution_image": r["resolution_image"],
                "resolution_date": r["resolution_date"],
                "likes": display_likes,
                "user_liked": user_liked,
                "status": "RESOLVED",
                "created_at": r["created_at"]
            })

        conn.close()
        return jsonify(feed_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/feed/<int:post_id>/toggle-like", methods=["POST"])
def toggle_like_feed_post(post_id):
    try:
        data = request.get_json() or {}
        user_email = data.get("user_email", "").strip().lower()

        if not user_email:
            user_email = "citizen@civiceye.com"

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if already liked
        cursor.execute("SELECT id FROM post_likes WHERE post_id = ? AND user_email = ?", (post_id, user_email))
        existing_like = cursor.fetchone()

        if existing_like:
            # Unlike: Remove from post_likes
            cursor.execute("DELETE FROM post_likes WHERE post_id = ? AND user_email = ?", (post_id, user_email))
            liked = False
        else:
            # Like: Insert into post_likes
            date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("INSERT OR IGNORE INTO post_likes (post_id, user_email, created_at) VALUES (?, ?, ?)", (post_id, user_email, date_str))
            liked = True

        # Calculate exact real likes count
        cursor.execute("SELECT COUNT(*) FROM post_likes WHERE post_id = ?", (post_id,))
        likes_count = cursor.fetchone()[0]

        # Update cache in feed_posts
        cursor.execute("UPDATE feed_posts SET likes = ? WHERE id = ?", (likes_count, post_id))

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "liked": liked,
            "likes": likes_count,
            "message": "Post liked" if liked else "Post un-liked"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/admin/feed/post", methods=["POST"])
def create_admin_feed_post():
    try:
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()

        if token != ADMIN_TOKEN:
            return jsonify({
                "success": False,
                "error": "Access Denied: Only Municipality Admin can create posts"
            }), 403

        admin_name = request.form.get("admin_name") or (request.json.get("admin_name", "Shimoga Municipal Corporation") if request.is_json else "Shimoga Municipal Corporation")
        title = request.form.get("title") or (request.json.get("title", "🕳️ Pothole Resolved") if request.is_json else "🕳️ Pothole Resolved")
        issue_type = request.form.get("issue_type") or (request.json.get("issue_type", "Pothole") if request.is_json else "Pothole")
        location = request.form.get("location") or (request.json.get("location", "Shimoga") if request.is_json else "Shimoga")
        problem = request.form.get("problem_description") or (request.json.get("problem_description", "Large pothole reported by citizens.") if request.is_json else "Large pothole reported by citizens.")
        resolution = request.form.get("resolution_description") or (request.json.get("resolution_description", "Road repair completed by municipality.") if request.is_json else "Road repair completed by municipality.")

        resolution_image_url = ""
        if "resolution_image" in request.files:
            file = request.files["resolution_image"]
            if file and file.filename != "":
                filename = f"feed_{int(datetime.now().timestamp())}_{file.filename}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                resolution_image_url = f"http://127.0.0.1:5000/uploads/{filename}"

        date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO feed_posts (complaint_id, admin_name, title, issue_type, location, problem_description, resolution_description, resolution_image, resolution_date, likes, created_at)
            VALUES (0, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        """, (admin_name, title, issue_type, location, problem, resolution, resolution_image_url, date_str, date_str))
        conn.commit()
        post_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "message": "Feed post created successfully",
            "post_id": post_id
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/admin/complaints/<int:complaint_id>", methods=["PUT"])
def update_admin_complaint(complaint_id):
    try:
        # Security Check: Protect status-update API so ONLY Municipality Admin can use it
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()

        if token != ADMIN_TOKEN:
            return jsonify({
                "success": False,
                "error": "Access Denied: Only Municipality Admin can update complaint status"
            }), 403

        data = request.get_json() or {}
        new_status = data.get("status")
        new_dept = data.get("department")
        new_notes = data.get("officer_notes")

        allowed_statuses = ["Pending", "In Progress", "Resolved", "Rejected"]
        if new_status and new_status not in allowed_statuses:
            return jsonify({
                "success": False,
                "error": f"Invalid status: {new_status}. Allowed values: Pending, In Progress, Resolved, Rejected"
            }), 400

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        updates = []
        params = []

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if new_status:
            updates.append("status = ?")
            params.append(new_status)
            if new_status == "In Progress":
                updates.append("in_progress_time = CASE WHEN in_progress_time IS NULL OR in_progress_time = '' THEN ? ELSE in_progress_time END")
                params.append(now_str)
            elif new_status == "Resolved":
                updates.append("resolved_time = CASE WHEN resolved_time IS NULL OR resolved_time = '' THEN ? ELSE resolved_time END")
                params.append(now_str)
                updates.append("resolution_date = CASE WHEN resolution_date IS NULL OR resolution_date = '' THEN ? ELSE resolution_date END")
                params.append(now_str)
        if new_dept:
            updates.append("department = ?")
            params.append(new_dept)
        if new_notes is not None:
            updates.append("officer_notes = ?")
            params.append(new_notes)

        if updates:
            params.append(complaint_id)
            query = f"UPDATE complaints SET {', '.join(updates)} WHERE id = ?"
            cursor.execute(query, tuple(params))
            conn.commit()

        conn.close()
        return jsonify({
            "success": True,
            "message": f"Complaint #{complaint_id} status updated successfully to '{new_status}' in database"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/complaint/submit", methods=["POST"])
def submit_citizen_complaint():
    try:
        data = request.get_json() or {}
        issue = data.get("issue", "No Issue Detected")
        confidence = float(data.get("confidence", 0))
        severity = data.get("severity", "LOW")
        location = data.get("location", "")
        description = data.get("description", "")
        prediction_image = data.get("prediction_image", "")
        citizen_name = data.get("citizen_name", "Registered Citizen")
        citizen_email = data.get("citizen_email", "citizen@civiceye.com")
        citizen_phone = data.get("citizen_phone", "+91 9876543210")

        if "pothole" in issue.lower():
            department = "PWD & Roads"
        elif "garbage" in issue.lower():
            department = "Solid Waste Mgmt"
        elif "water" in issue.lower():
            department = "Water Supply & Sewerage"
        else:
            department = "PWD & Roads"

        time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO complaints (issue, confidence, severity, status, time, prediction_image, location, description, department, citizen_name, citizen_email, citizen_phone, officer_notes)
            VALUES (?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?, ?, ?, '')
        """, (issue, confidence, severity, time_str, prediction_image, location, description, department, citizen_name, citizen_email, citizen_phone))
        conn.commit()
        complaint_id = cursor.lastrowid
        conn.close()

        new_record = {
            "id": complaint_id,
            "issue": issue,
            "confidence": confidence,
            "severity": severity,
            "status": "Pending",
            "time": time_str,
            "prediction_image": prediction_image,
            "location": location,
            "description": description,
            "department": department,
            "citizen_name": citizen_name,
            "citizen_email": citizen_email,
            "citizen_phone": citizen_phone,
            "officer_notes": ""
        }
        history.append(new_record)

        return jsonify({"success": True, "message": "Complaint submitted successfully", "complaint": new_record}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# =========================================================
# SOFT DELETE & ARCHIVE ENDPOINTS (PROTECTED & CONSTRAINED)
# =========================================================

@app.route("/api/complaints/<int:complaint_id>", methods=["DELETE"])
def citizen_delete_complaint(complaint_id):
    try:
        data = request.get_json() or {}
        user_email = data.get("user_email", "").strip().lower()

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT status, citizen_email FROM complaints WHERE id = ?", (complaint_id,))
        row = cursor.fetchone()

        if not row:
            conn.close()
            return jsonify({"success": False, "error": "Complaint not found"}), 404

        status = row["status"]
        owner_email = (row["citizen_email"] or "").strip().lower()

        # Rule 1: Citizens can ONLY archive RESOLVED complaints
        if status != "Resolved":
            conn.close()
            return jsonify({
                "success": False,
                "error": f"Cannot remove complaint with status '{status}'. Citizens can only remove Resolved/Completed complaints from history."
            }), 400

        # Rule 2: Citizens can ONLY archive their own complaints
        if user_email and owner_email and user_email != owner_email:
            conn.close()
            return jsonify({
                "success": False,
                "error": "Unauthorized: You can only remove your own complaints from history."
            }), 403

        # Soft Delete / Archive
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("UPDATE complaints SET is_deleted = 1, deleted_at = ? WHERE id = ?", (now_str, complaint_id))
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Complaint #{complaint_id} removed from your visible history (archived safely)."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/admin/complaints/<int:complaint_id>", methods=["DELETE"])
def admin_archive_complaint(complaint_id):
    try:
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()

        if token != ADMIN_TOKEN:
            return jsonify({
                "success": False,
                "error": "Access Denied: Only Municipality Admin can archive complaints"
            }), 403

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT status FROM complaints WHERE id = ?", (complaint_id,))
        row = cursor.fetchone()

        if not row:
            conn.close()
            return jsonify({"success": False, "error": "Complaint not found"}), 404

        status = row["status"]

        # Rule: Admin can ONLY archive RESOLVED complaints
        if status != "Resolved":
            conn.close()
            return jsonify({
                "success": False,
                "error": f"Cannot archive complaint with status '{status}'. Admins can only archive Resolved/Completed complaints."
            }), 400

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("UPDATE complaints SET is_deleted = 1, deleted_at = ? WHERE id = ?", (now_str, complaint_id))
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Complaint #{complaint_id} archived successfully by Municipality Admin."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/admin/complaints/<int:complaint_id>/restore", methods=["POST"])
def admin_restore_complaint(complaint_id):
    try:
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()

        if token != ADMIN_TOKEN:
            return jsonify({
                "success": False,
                "error": "Access Denied: Only Municipality Admin can restore complaints"
            }), 403

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE complaints SET is_deleted = 0, deleted_at = '' WHERE id = ?", (complaint_id,))
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Complaint #{complaint_id} restored to active list."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/admin/feed/posts/<int:post_id>", methods=["DELETE"])
def admin_archive_feed_post(post_id):
    try:
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()

        if token != ADMIN_TOKEN:
            return jsonify({
                "success": False,
                "error": "Access Denied: Only Municipality Admin can archive resolution posts"
            }), 403

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE feed_posts SET is_deleted = 1, deleted_at = ? WHERE id = ?", (now_str, post_id))
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Resolution post #{post_id} archived from feed."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500



# =========================
# RUN
# =========================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True
    )
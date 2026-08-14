from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# =========================
# LOAD MODEL
# =========================

model = YOLO("best.pt")

# =========================
# FOLDERS
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
PREDICT_FOLDER = os.path.join(BASE_DIR, "predictions")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PREDICT_FOLDER, exist_ok=True)

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
            return jsonify({
                "error": "No image uploaded"
            }), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({
                "error": "No file selected"
            }), 400


        # -------------------------
        # SAVE IMAGE
        # -------------------------

        filepath = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        file.save(filepath)


        # -------------------------
        # RUN YOLO
        # -------------------------

        results = model.predict(
            source=filepath,
            save=True,
            project=PREDICT_FOLDER,
            name="result",
            exist_ok=True
        )


        detections = []


        # -------------------------
        # FIND PREDICTION IMAGE
        # -------------------------

        prediction_folder = os.path.join(
            PREDICT_FOLDER,
            "result"
        )

        prediction_image = None

        if os.path.exists(prediction_folder):

            images = [
                f
                for f in os.listdir(prediction_folder)
                if f.lower().endswith(
                    (".jpg", ".jpeg", ".png")
                )
            ]

            if images:

                prediction_image = max(
                    images,
                    key=lambda x: os.path.getmtime(
                        os.path.join(
                            prediction_folder,
                            x
                        )
                    )
                )


        # -------------------------
        # READ ALL DETECTIONS
        # -------------------------

        for result in results:

            for box in result.boxes:

                class_id = int(box.cls[0])

                confidence = round(
                    float(box.conf[0]) * 100,
                    2
                )

                issue = model.names[class_id]


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
                # DETECTION
                # -------------------------

                detection = {

                    "issue": issue,

                    "confidence": confidence,

                    "severity": severity,

                    "status": "Pending",

                    "time": datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),

                    "prediction_image":
                        prediction_image
                }


                # Keep ALL detections
                # for AI Detection Report

                detections.append(
                    detection
                )


        # =====================================================
        # HISTORY
        # =====================================================
        #
        # IMPORTANT:
        # Only ONE detection from this uploaded image
        # is added to history.
        #
        # We choose the detection with the highest confidence.
        #
        # This makes Analytics count uploaded images
        # instead of counting every bounding box.
        # =====================================================

        if len(detections) > 0:

            strongest_detection = max(
                detections,
                key=lambda x: x["confidence"]
            )

            history.append(
                strongest_detection
            )


        # -------------------------
        # NO DETECTION
        # -------------------------

        else:

            detection = {

                "issue":
                    "No Issue Detected",

                "confidence":
                    0,

                "severity":
                    "LOW",

                "status":
                    "Pending",

                "time":
                    datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),

                "prediction_image":
                    prediction_image
            }


            detections.append(
                detection
            )


            # One history record
            # for this uploaded image

            history.append(
                detection
            )


        # -------------------------
        # PREDICTION URL
        # -------------------------

        prediction_url = None

        if prediction_image:

            prediction_url = (
                "http://127.0.0.1:5000/"
                f"prediction/{prediction_image}"
            )


        # -------------------------
        # RESPONSE
        # -------------------------

        return jsonify({

            # ALL AI detections
            "detections":
                detections,

            # AI prediction image
            "prediction_image":
                prediction_url
        })


    except Exception as e:

        return jsonify({

            "error":
                str(e)

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
# HISTORY
# =========================

@app.route("/history")
def get_history():

    return jsonify(
        history[-20:]
    )


# =========================
# RUN
# =========================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True
    )
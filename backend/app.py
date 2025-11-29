from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import json
import os
app = Flask(__name__)
CORS(app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Load model
model = joblib.load("model/naive_bayes2.pkl")

# Load accuracy
with open(os.path.join(BASE_DIR, "model/accuracy.json")) as f:
    accuracy_data = json.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    fitur = np.array([data["fitur"]], dtype=float)

    prediksi = model.predict(fitur)[0]

    return jsonify({
        "method": data.get("method", "naive-bayes"),
        "prediction": str(prediksi)
    })


@app.route("/accuracy", methods=["GET"])
def get_accuracy():
    return jsonify({
        "accuracy": accuracy_data["accuracy"],
        "report": accuracy_data["report"]
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

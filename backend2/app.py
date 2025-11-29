from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load Naive Bayes model
nb_model = joblib.load(os.path.join(BASE_DIR, "model/naive_bayes.pkl"))

# Load ID3 model
id3_model = joblib.load(os.path.join(BASE_DIR, "model/id3.pkl"))

# Load accuracy data
with open(os.path.join(BASE_DIR, "model/accuracy.json")) as f:
    accuracy_data = json.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    """
    Endpoint untuk prediksi menggunakan Naive Bayes
    """
    data = request.json
    fitur = np.array([data["fitur"]], dtype=float)
    prediksi = nb_model.predict(fitur)[0]

    return jsonify({
        "method": "naive-bayes",
        "prediction": str(prediksi)
    })


@app.route("/idtree", methods=["POST"])
def idtree():
    """
    Endpoint untuk prediksi menggunakan ID3 / Decision Tree
    """
    data = request.json
    fitur = np.array([data["fitur"]], dtype=float)
    prediksi = id3_model.predict(fitur)[0]

    return jsonify({
        "method": "id3",
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

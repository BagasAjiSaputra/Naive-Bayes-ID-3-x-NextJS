from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import json
import os
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__)
CORS(app)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path Model
nb_model = joblib.load(os.path.join(BASE_DIR, "model/naive_bayes.pkl"))

id3_model = joblib.load(os.path.join(BASE_DIR, "model/id3.pkl"))

# Path Akurasi JSON
with open(os.path.join(BASE_DIR, "Naive.json")) as f:
    naive_json = json.load(f)

with open(os.path.join(BASE_DIR, "ID3.json")) as g:
    id3_json = json.load(g)

# API Naive Bayes
@app.route("/predict", methods=["POST"])
def predict():
    
    data = request.json
    fitur = np.array([data["fitur"]], dtype=float)
    prediksi = nb_model.predict(fitur)[0]

    return jsonify({
        "method": "naive-bayes",
        "prediction": str(prediksi)})


# API ID3
@app.route("/idtree", methods=["POST"])
def idtree():
    
    data = request.json
    fitur = np.array([data["fitur"]], dtype=float)
    prediksi = id3_model.predict(fitur)[0]

    return jsonify({
        "method": "id3",
        "prediction": str(prediksi)})

# API Akurasi Naive Bayes
@app.route("/accuracy", methods=["GET"])
def naive_accuracy():
    return jsonify(naive_json)

# API Akurasi ID3
@app.route("/id3accuracy", methods=["GET"])
def id3_accuracy():
    return jsonify(id3_json)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
"use client";

import React, { useState, useCallback } from "react";

const API_BASE_URL = "http://localhost:5000";

const App = () => {
  const [featuresInput, setFeaturesInput] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseFeatures = (inputString) => {
    return inputString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => {
        const num = parseFloat(s);
        if (isNaN(num)) throw new Error("Input harus berupa angka yang dipisahkan koma.");
        return num;
      });
  };

  const handlePredict = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    setMethod(null);

    try {
      const parsedFeatures = parseFeatures(featuresInput);

      if (parsedFeatures.length === 0) throw new Error("Masukkan setidaknya satu fitur untuk prediksi.");

      const payload = { fitur: parsedFeatures };
      const maxRetries = 3;
      let response;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          response = await fetch(`${API_BASE_URL}/idtree`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) break;
          if (attempt === maxRetries - 1) throw new Error(`Gagal menghubungi server setelah ${maxRetries} percobaan.`);
          await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        } catch (fetchError) {
          if (attempt === maxRetries - 1) throw new Error(`Gagal mengirim permintaan: ${fetchError.message}`);
          await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Prediksi gagal. Status: ${response.status}. Pesan: ${errorText.substring(0, 100)}...`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setMethod(data.method);
    } catch (err) {
      console.error("Error during prediction:", err);
      setError(err.message || "Terjadi kesalahan saat prediksi.");
    } finally {
      setLoading(false);
    }
  }, [featuresInput]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          <span className="text-teal-600">ID3</span> Decision Tree Predictor
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Masukkan fitur sebagai angka yang dipisahkan koma untuk memprediksi hasil ID3.
        </p>

        <div className="mb-6">
          <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
            Input Fitur
          </label>
          <input
            id="features"
            type="text"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="Contoh: 1.2, 3.4, 5.0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150 shadow-sm"
            disabled={loading}
          />
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </>
          ) : (
            "Dapatkan Prediksi ID3"
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-inner">
            <h4 className="font-semibold">Kesalahan Prediksi</h4>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {prediction !== null && !loading && (
          <div className="mt-6 p-6 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-700 mb-2">Hasil Prediksi</h3>
            <p className="text-lg text-gray-800">
              <span className="font-semibold">Metode:</span> <span className="text-teal-600 uppercase">{method}</span>
            </p>
            <p className="text-lg text-gray-800 mt-1">
              <span className="font-semibold">Hasil:</span> <span className="text-2xl font-extrabold text-green-600 ml-2">{prediction}</span>
            </p>
            <p className="text-xs text-gray-500 mt-3 italic">
              *Pastikan server Flask Anda berjalan dan model ID3 (`id3.pkl`) tersedia.
            </p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <a
            href={`${API_BASE_URL}/accuracy`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150"
          >
            Lihat Data Akurasi Model (/accuracy)
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;

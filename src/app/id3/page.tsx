"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ID3page() {
  const [fitur, setFitur] = useState<string[]>(Array(11).fill(""));
  const [bulkInput, setBulkInput] = useState("");
  const [result, setResult] = useState("");
  const [method, setMethod] = useState("");
  const [metrics, setMetrics] = useState<any>(null);

  // === Ambil Akurasi ID3 ===
  useEffect(() => {
    const fetchAccuracy = async () => {
      const res = await fetch("http://localhost:5000/id3accuracy");
      const data = await res.json();
      setMetrics(data);
    };
    fetchAccuracy();
  }, []);

  const handleChange = (i: number, value: string) => {
    const copy = [...fitur];
    copy[i] = value;
    setFitur(copy);
  };

  // === INPUT INSTAN DIPISAH KOMA ===
  const handleBulkInput = (value: string) => {
    setBulkInput(value);

    const split = value.split(",").map((v) => v.trim());
    if (split.length === 11) {
      setFitur(split);
    }
  };

  const handlePredict = async () => {
    const fiturNumber = fitur.map((f) => Number(f));

    const res = await fetch("http://localhost:5000/idtree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "id3",
        fitur: fiturNumber,
      }),
    });

    const data = await res.json();
    setResult(String(data.prediction));
    setMethod(String(data.method));
  };

  // Label Fitur
  const featureNames = [
    "fixed acidity",
    "volatile acidity",
    "citric acid",
    "residual sugar",
    "chlorides",
    "free sulfur dioxide",
    "total sulfur dioxide",
    "density",
    "pH",
    "sulphates",
    "alcohol"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-1/2 mx-auto p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold">ID3 Decision Tree Wine Quality</h1>

      {/* === CARD AKURASI === */}
      {metrics ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-white shadow-md border border-gray-100 space-y-3"
        >
          <h2 className="text-lg font-bold text-gray-800 text-center">
            Performa Model
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

            {/* Akurasi */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-2 bg-blue-200 text-blue-700 font-semibold rounded-lg shadow-sm text-center"
            >
              Akurasi: {(metrics.accuracy * 100).toFixed(2)}%
            </motion.div>

            {/* Precision */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-2 bg-purple-200 text-purple-700 font-semibold rounded-lg shadow-sm text-center"
            >
              Precision: {metrics.precision_macro.toFixed(3)}
            </motion.div>

            {/* Recall */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-2 bg-green-200 text-green-700 font-semibold rounded-lg shadow-sm text-center"
            >
              Recall: {metrics.recall_macro.toFixed(3)}
            </motion.div>

            {/* F1 Macro */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-2 bg-yellow-200 text-yellow-700 font-semibold rounded-lg shadow-sm text-center"
            >
              F1 Macro: {metrics.f1_macro.toFixed(3)}
            </motion.div>

            {/* F1 Weighted */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-2 bg-red-200 text-red-700 font-semibold rounded-lg shadow-sm text-center"
            >
              F1 Weighted: {metrics.f1_weighted.toFixed(3)}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        "Loading accuracy..."
      )}

      {/* === INPUT INSTAN === */}
      <input
        type="text"
        placeholder="Input 11 fitur dipisah koma"
        value={bulkInput}
        onChange={(e) => handleBulkInput(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-300 transition-shadow duration-200 font-mono text-sm"
      />

      {/* Input Fitur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {featureNames.map((name, index) => (
          <div key={index} className="flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700 mb-1">
              {name}
            </label>

            <input
              type="number"
              value={fitur[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-full p-2 rounded-xl border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-shadow duration-200"
            />
          </div>
        ))}
      </div>

      {/* === BUTTON === */}
      <button
        onClick={handlePredict}
        className="bg-teal-600 text-white p-3 rounded-xl w-full shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        Predict ID3
      </button>

      {/* === HASIL === */}
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-100 p-4 rounded-xl text-lg font-semibold text-center shadow-sm"
        >
          <p>Metode: <span className="text-teal-600">{method}</span></p>
          <p className="mt-2">Hasil Prediksi: {result}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
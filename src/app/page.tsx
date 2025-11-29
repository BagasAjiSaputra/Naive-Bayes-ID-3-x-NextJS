"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function NaiveBayesPage() {
  const [fitur, setFitur] = useState<string[]>(Array(11).fill(""));
  const [bulkInput, setBulkInput] = useState(""); // ⬅ Tambahan
  const [result, setResult] = useState("");
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // === Ambil Akurasi ===
  useEffect(() => {
    const fetchAccuracy = async () => {
      const res = await fetch("http://localhost:5000/accuracy");
      const data = await res.json();
      setAccuracy(data.accuracy);
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

    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "naive_bayes",
        fitur: fiturNumber,
      }),
    });

    const data = await res.json();
    setResult(String(data.prediction));
  };

  return (
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="max-w-lg mx-auto p-6 space-y-6"
>
  <h1 className="text-2xl font-bold">Naive Bayes Prediction</h1>

  {/* === CARD AKURASI === */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-4 rounded-lg bg-green-100 text-green-800 font-semibold text-center shadow-md"
  >
    {accuracy !== null
      ? <>Akurasi Model: {(accuracy * 100).toFixed(2)}%</>
      : "Loading accuracy..."}
  </motion.div>

  {/* === INPUT INSTAN 1 BARIS === */}
  <input
    type="text"
    placeholder="Input 11 fitur dipisah koma"
    value={bulkInput}
    onChange={(e) => handleBulkInput(e.target.value)}
    className="w-full p-3 rounded-xl border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-shadow duration-200 font-mono text-sm"
  />

  {/* === INPUT FITUR === */}
  <div className="grid grid-cols-2 gap-3">
    {fitur.map((v, index) => (
      <input
        key={index}
        type="number"
        placeholder={`Fitur ${index + 1}`}
        value={v}
        onChange={(e) => handleChange(index, e.target.value)}
        className="w-full p-2 rounded-xl border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-shadow duration-200"
      />
    ))}
  </div>

  {/* === BUTTON === */}
  <button
    onClick={handlePredict}
    className="bg-blue-600 text-white p-3 rounded-xl w-full shadow-md hover:shadow-lg transition-shadow duration-200"
  >
    Predict
  </button>

  {/* === HASIL === */}
  {result && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-100 p-4 rounded-xl text-lg font-semibold text-center shadow-sm"
    >
      Hasil Prediksi: {result}
    </motion.div>
  )}
</motion.div>

  );
}

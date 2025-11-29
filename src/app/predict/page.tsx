// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Sparkles, Beaker, Activity, TrendingUp, Droplet, Thermometer, Wind, Gauge, Zap } from "lucide-react";

// const FEATURES = [
//   { key: "fixed_acidity", label: "Fixed Acidity", icon: Beaker, color: "from-purple-500 to-indigo-600" },
//   { key: "volatile_acidity", label: "Volatile Acidity", icon: Wind, color: "from-blue-500 to-cyan-600" },
//   { key: "citric_acid", label: "Citric Acid", icon: Droplet, color: "from-yellow-500 to-orange-600" },
//   { key: "residual_sugar", label: "Residual Sugar", icon: Sparkles, color: "from-pink-500 to-rose-600" },
//   { key: "chlorides", label: "Chlorides", icon: Activity, color: "from-green-500 to-teal-600" },
//   { key: "free_sulfur_dioxide", label: "Free Sulfur Dioxide", icon: Zap, color: "from-red-500 to-pink-600" },
//   { key: "total_sulfur_dioxide", label: "Total Sulfur Dioxide", icon: Gauge, color: "from-indigo-500 to-purple-600" },
//   { key: "density", label: "Density", icon: Activity, color: "from-cyan-500 to-blue-600" },
//   { key: "pH", label: "pH", icon: Thermometer, color: "from-orange-500 to-red-600" },
//   { key: "sulphates", label: "Sulphates", icon: Beaker, color: "from-teal-500 to-green-600" },
//   { key: "alcohol", label: "Alcohol", icon: TrendingUp, color: "from-rose-500 to-pink-600" },
// ];

// export default function PredictWineInteractive() {
//   const [form, setForm] = useState<any>({});
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeFeature, setActiveFeature] = useState<string | null>(null);
//   const [isHovering, setIsHovering] = useState(false);
//   const [bgAnimation, setBgAnimation] = useState(0);

//   // Background animation effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBgAnimation(prev => (prev + 1) % 360);
//     }, 50);
//     return () => clearInterval(interval);
//   }, []);

//   const handleChange = (key: string, value: string) => {
//     setForm((prev: any) => ({ ...prev, [key]: value }));
//   };

//   const handlePredict = async () => {
//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const res = await fetch("http://127.0.0.1:5000/api/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (!res.ok) setError(data.message || "Terjadi kesalahan");
//       else setResult(data);
//     } catch (e) {
//       setError("Gagal terhubung ke backend Flask");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen p-4 md:p-10 relative overflow-hidden">
//       {/* Animated Background */}
//       <div 
//         className="absolute inset-0 opacity-20"
//         style={{
//           background: `linear-gradient(${bgAnimation}deg, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.5) 25%, rgba(236, 72, 153, 0.5) 50%, rgba(248, 113, 113, 0.5) 75%, rgba(99, 102, 241, 0.5) 100%)`,
//         }}
//       />
      
//       {/* Floating orbs */}
//       <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//       <div className="absolute top-40 right-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//       <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
//       <motion.div
//         initial={{ opacity: 0, y: 20, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-5xl mx-auto relative z-10"
//       >
//         <motion.div 
//           className="text-center mb-10"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//         >
//           <motion.h1 
//             className="text-5xl md:text-6xl font-extrabold mb-4"
//             whileHover={{ scale: 1.05 }}
//           >
//             <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
//               🍷 Wine Quality AI
//             </span>
//           </motion.h1>
//           <motion.p 
//             className="text-xl text-gray-700 max-w-2xl mx-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//           >
//             Discover the quality of your wine through advanced machine learning analysis
//           </motion.p>
//         </motion.div>

//         {/* Feature Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//           {FEATURES.map((item, i) => {
//             const Icon = item.icon;
//             return (
//               <motion.div
//                 key={item.key}
//                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 transition={{ delay: i * 0.05, duration: 0.5 }}
//                 whileHover={{ 
//                   scale: 1.03, 
//                   boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
//                   y: -5
//                 }}
//                 onHoverStart={() => setActiveFeature(item.key)}
//                 onHoverEnd={() => setActiveFeature(null)}
//                 className={`p-5 rounded-2xl bg-white shadow-lg border border-gray-100 relative overflow-hidden transition-all duration-300 ${activeFeature === item.key ? 'ring-2 ring-purple-500' : ''}`}
//               >
//                 {/* Background gradient */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5`}></div>
                
//                 {/* Icon and label */}
//                 <div className="flex items-center mb-3 relative z-10">
//                   <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white mr-3`}>
//                     <Icon size={20} />
//                   </div>
//                   <label className="font-semibold text-gray-700 text-lg">
//                     {item.label}
//                   </label>
//                 </div>

//                 {/* Input field */}
//                 <motion.input
//                   whileFocus={{ scale: 1.02 }}
//                   type="number"
//                   step="any"
//                   onChange={(e) => handleChange(item.key, e.target.value)}
//                   className="mt-2 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-10 bg-white"
//                   placeholder="Enter value"
//                 />
                
//                 {/* Animated highlight when active */}
//                 {activeFeature === item.key && (
//                   <motion.div 
//                     className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
//                     initial={{ width: 0 }}
//                     animate={{ width: "100%" }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Predict Button */}
//         <motion.div className="flex justify-center mb-10">
//           <motion.button
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={handlePredict}
//             disabled={loading}
//             className="relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg overflow-hidden group"
//             onMouseEnter={() => setIsHovering(true)}
//             onMouseLeave={() => setIsHovering(false)}
//           >
//             {/* Button background animation */}
//             <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
//             {/* Button content */}
//             <span className="relative z-10 flex items-center">
//               {loading ? (
//                 <>
//                   <motion.div
//                     className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   🚀 Predict Now
//                   <motion.div
//                     className="ml-2"
//                     animate={{ x: isHovering ? 5 : 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     →
//                   </motion.div>
//                 </>
//               )}
//             </span>
//           </motion.button>
//         </motion.div>

//         {/* Error Message */}
//         <AnimatePresence>
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-center font-medium"
//             >
//               {error}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Results Section */}
//         <AnimatePresence>
//           {result && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="p-8 rounded-3xl bg-white bg-opacity-90 backdrop-blur-lg shadow-xl border border-gray-100"
//             >
//               <motion.h2 
//                 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 🎯 Prediction Result
//               </motion.h2>

//               <motion.div 
//                 className="text-center mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <p className="text-lg text-gray-600 mb-2">Predicted Quality</p>
//                 <motion.div 
//                   className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
//                 >
//                   {result.quality_prediction}
//                 </motion.div>
//                 <div className="flex justify-center mt-4">
//                   {[...Array(10)].map((_, i) => (
//                     <motion.div
//                       key={i}
//                       className="w-3 h-3 mx-1 rounded-full"
//                       style={{ 
//                         backgroundColor: i < result.quality_prediction ? "#9333ea" : "#e5e7eb"
//                       }}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ delay: 0.5 + i * 0.05 }}
//                     />
//                   ))}
//                 </div>
//               </motion.div>

//               {/* Probability Breakdown */}
//               <motion.h3 
//                 className="text-xl font-bold mb-4 text-indigo-600"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 Probability Breakdown
//               </motion.h3>

//               <div className="space-y-4">
//                 {Object.entries(result.probabilities)
//                   .sort(([, a], [, b]) => (b as number) - (a as number))
//                   .map(([k, v], i) => (
//                   <motion.div
//                     key={k}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.7 + i * 0.1 }}
//                     className="relative"
//                   >
//                     <div className="flex justify-between font-medium mb-2">
//                       <span className="text-gray-700">Quality {k}</span>
//                       <span className="text-purple-600 font-bold">{(v as number).toFixed(3)}</span>
//                     </div>

//                     <div className="h-6 rounded-full bg-gray-200 overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${(v as number) * 100}%` }}
//                         transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: "easeOut" }}
//                         className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 relative"
//                       >
//                         <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
//                       </motion.div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
      
//       <style jsx>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// }
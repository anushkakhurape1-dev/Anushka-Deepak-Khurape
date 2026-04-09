import React, { useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, MapPin, ChevronRight, Check, Loader2, IndianRupee, Info, Recycle } from 'lucide-react';
import { estimateEWasteValue, EstimationResult } from '../services/geminiService';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError } from '../lib/utils';
import { OperationType } from '../types';

export const RequestPickup: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Working but old');
  const [estimation, setEstimation] = useState<EstimationResult | null>(null);
  const [address, setAddress] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Laptop', 'Desktop', 'Mobile Phone', 'Refrigerator', 'Washing Machine', 
    'TV', 'Microwave', 'Printer', 'AC', 'Battery', 'Misc Electronics'
  ];

  const conditions = ['Completely dead', 'Working but old', 'Partially working', 'Scrap condition'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEstimate = async () => {
    if (!image || !category) return;
    setLoading(true);
    try {
      const result = await estimateEWasteValue(image, category, condition);
      setEstimation(result);
      setStep(3);
    } catch (error) {
      console.error("Estimation error:", error);
      alert("AI estimation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !estimation) return;
    setLoading(true);
    try {
      const pickupData = {
        userId: user.uid,
        category,
        condition,
        brand: estimation.brand,
        model: estimation.model,
        photos: [image],
        address,
        location: { lat: 19.076, lng: 72.877 }, // Mock location for demo
        status: 'pending',
        estimatedPayout: (estimation.estimatedPayoutRange.min + estimation.estimatedPayoutRange.max) / 2,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'pickups'), pickupData);
      setStep(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pickups');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-green-600' : 'bg-gray-100'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">What are you recycling?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-2xl border-2 transition-all text-sm font-medium ${
                    category === cat ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              disabled={!category}
              onClick={() => setStep(2)}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Upload a photo & condition</h2>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative"
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-gray-500 font-medium">Click to upload photo</p>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Condition</label>
              <div className="grid grid-cols-2 gap-3">
                {conditions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      condition === c ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 text-gray-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!image || loading}
              onClick={handleEstimate}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get AI Estimation'}
            </button>
          </motion.div>
        )}

        {step === 3 && estimation && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-green-600 rounded-3xl p-8 text-white shadow-xl shadow-green-100 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-green-100 text-sm font-bold uppercase tracking-widest mb-1">Estimated Payout</p>
                <h3 className="text-4xl font-bold flex items-center gap-1">
                  <IndianRupee className="w-8 h-8" />
                  {estimation.estimatedPayoutRange.min} - {estimation.estimatedPayoutRange.max}
                </h3>
                <div className="mt-6 flex items-center gap-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <Info className="w-5 h-5" />
                  <p className="text-xs">{estimation.reasoning}</p>
                </div>
              </div>
              <Recycle className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10" />
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Brand</span>
                <span className="font-bold">{estimation.brand}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Model</span>
                <span className="font-bold">{estimation.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="font-bold">{estimation.category}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold"
            >
              Confirm & Set Location
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Pickup Location</h2>
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  placeholder="Enter full address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pl-12 h-32 focus:border-green-600 outline-none transition-all"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
                <Info className="text-blue-600 w-5 h-5 shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Our collector will verify the item condition and weight upon arrival. The final payout may vary slightly.
                </p>
              </div>
            </div>

            <button
              disabled={!address || loading}
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Schedule Pickup'}
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Request Confirmed!</h2>
            <p className="text-gray-500">A collector will be assigned to your request shortly. You can track the status in your dashboard.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

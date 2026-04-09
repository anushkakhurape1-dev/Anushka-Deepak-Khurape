import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { PickupRequest } from '../types';
import { motion } from 'motion/react';
import { MapPin, User, Phone, CheckCircle, Navigation, IndianRupee } from 'lucide-react';

export const CollectorHub: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for pending requests
    const q = query(
      collection(db, 'pickups'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PickupRequest));
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (pickupId: string) => {
    if (!user) return;
    const pickupRef = doc(db, 'pickups', pickupId);
    await updateDoc(pickupRef, {
      status: 'accepted',
      collectorId: user.uid,
      updatedAt: serverTimestamp()
    });
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading requests...</div>;

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collector Hub</h1>
          <p className="text-gray-500">Available pickups in your area.</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
          Online
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.length === 0 ? (
          <div className="col-span-full bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
            <Navigation className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No pending requests right now. Check back soon!</p>
          </div>
        ) : (
          requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={request.photos[0]} alt={request.category} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{request.category}</h3>
                    <p className="text-sm text-gray-500">{request.brand} {request.model}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Payout</p>
                  <p className="text-xl font-bold text-green-600 flex items-center justify-end">
                    <IndianRupee className="w-4 h-4" /> {request.estimatedPayout}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">{request.address}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 px-2">
                  <User className="w-4 h-4" />
                  <span>Customer ID: ...{request.userId.slice(-6)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleAccept(request.id!)}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Accept Request
                </button>
                <button className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                  <Phone className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

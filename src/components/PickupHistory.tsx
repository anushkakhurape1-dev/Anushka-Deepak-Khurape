import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { PickupRequest } from '../types';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle2, XCircle, MapPin, IndianRupee } from 'lucide-react';

export const PickupHistory: React.FC = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'pickups'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PickupRequest));
      setPickups(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'accepted': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading your history...</div>;

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">My Pickups</h1>
        <p className="text-gray-500">Track and manage your e-waste contributions.</p>
      </header>

      <div className="space-y-4">
        {pickups.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No pickups found. Start by requesting one!</p>
          </div>
        ) : (
          pickups.map((pickup, i) => {
            const StatusIcon = getStatusIcon(pickup.status);
            return (
              <motion.div
                key={pickup.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={pickup.photos[0]} alt={pickup.category} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{pickup.category}</h3>
                    <p className="text-sm text-gray-500">{pickup.brand} {pickup.model}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{pickup.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payout</span>
                    <span className="font-bold text-gray-900 flex items-center gap-0.5">
                      <IndianRupee className="w-3 h-3" />
                      {pickup.actualPayout || pickup.estimatedPayout}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold ${getStatusColor(pickup.status)}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="capitalize">{pickup.status}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

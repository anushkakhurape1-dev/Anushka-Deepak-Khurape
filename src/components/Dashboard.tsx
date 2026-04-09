import React from 'react';
import { useAuth } from './AuthContext';
import { motion } from 'motion/react';
import { Leaf, Recycle, Wind, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  const stats = [
    { label: 'Green Points', value: profile?.greenPoints || 0, icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'E-Waste Recycled', value: `${profile?.totalEWasteRecycled || 0} kg`, icon: Recycle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'CO2 Saved', value: `${profile?.totalCO2Saved || 0} kg`, icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Impact Rank', value: '#124', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {profile?.displayName?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Your sustainability journey is making a real difference.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-green-100 rounded-t-xl relative group"
                >
                  <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                </motion.div>
                <span className="text-xs font-mono text-gray-400">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-gray-200">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Eco Tip of the Day</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Recycling a single laptop saves enough energy to power a home for over 300 hours. Keep up the great work!
            </p>
            <button className="mt-6 bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Recycle className="w-48 h-48" />
          </div>
        </div>
      </div>
    </div>
  );
};

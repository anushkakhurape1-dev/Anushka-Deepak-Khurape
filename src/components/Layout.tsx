import React from 'react';
import { useAuth } from './AuthContext';
import { logout, signInWithGoogle } from '../lib/firebase';
import { Recycle, User, LogOut, LayoutDashboard, MapPin, Leaf } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-green-600 p-2 rounded-xl">
          <Recycle className="text-white w-6 h-6" />
        </div>
        <span className="font-sans font-bold text-xl tracking-tight text-gray-900">CircuitCycle</span>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{profile?.greenPoints || 0} pts</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-100">
              <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" referrerPolicy="no-referrer" />
            </div>
          </>
        ) : (
          <button 
            onClick={signInWithGoogle}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
};

export const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { profile } = useAuth();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pickup', label: 'Request Pickup', icon: MapPin },
    { id: 'history', label: 'My Pickups', icon: Recycle },
  ];

  if (profile?.role === 'collector') {
    tabs.unshift({ id: 'collector', label: 'Collector Hub', icon: User });
  }

  return (
    <div className="fixed left-0 top-20 bottom-0 w-20 md:w-64 bg-white border-right border-gray-100 p-4 hidden sm:flex flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
            activeTab === tab.id 
              ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <tab.icon className="w-6 h-6" />
          <span className="hidden md:inline font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

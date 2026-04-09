/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Navbar, Sidebar } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { RequestPickup } from './components/RequestPickup';
import { PickupHistory } from './components/PickupHistory';
import { CollectorHub } from './components/CollectorHub';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, profile, loading, isAuthReady } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pt-24 sm:pl-20 md:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'pickup' && <RequestPickup />}
          {activeTab === 'history' && <PickupHistory />}
          {activeTab === 'collector' && <CollectorHub />}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


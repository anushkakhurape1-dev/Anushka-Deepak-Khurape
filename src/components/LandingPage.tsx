import React from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { motion } from 'motion/react';
import { Recycle, Leaf, ShieldCheck, Zap, ArrowRight, IndianRupee } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-bold text-green-700 uppercase tracking-widest">The Future of E-Waste</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-[0.9] tracking-tight">
              Recycle Your Tech. <br />
              <span className="text-green-600">Get Paid Instantly.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
              CircuitCycle is the Uber for e-waste. Request a pickup from your doorstep, get AI-powered value estimation, and contribute to a greener planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={signInWithGoogle}
                className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-2xl shadow-gray-200"
              >
                Start Recycling Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-2xl font-bold text-lg text-gray-600 hover:bg-gray-50 transition-all">
                How it Works
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-green-600 rounded-[4rem] rotate-6 absolute inset-0 opacity-10" />
            <div className="relative bg-white border border-gray-100 rounded-[3rem] p-8 shadow-2xl shadow-green-100/50">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                      <Recycle className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">MacBook Pro M1</h4>
                      <p className="text-xs text-gray-400">Working Condition</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Estimated</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                      <IndianRupee className="w-5 h-5" /> 12,500
                    </p>
                  </div>
                </div>
                <div className="h-48 bg-gray-50 rounded-2xl overflow-hidden">
                  <img src="https://picsum.photos/seed/laptop/800/600" alt="Laptop" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-green-600 rounded-full" />
                  <div className="flex-1 h-2 bg-green-600 rounded-full" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { icon: Zap, title: "Instant Pickup", desc: "Schedule a pickup in seconds. Our collectors arrive at your doorstep within 24 hours." },
            { icon: ShieldCheck, title: "Secure Data Wiping", desc: "We ensure all your personal data is professionally wiped before recycling or refurbishment." },
            { icon: IndianRupee, title: "Best Scrap Rates", desc: "Our AI engine ensures you get the most accurate and highest value for your old electronics." }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
            >
              <div className="bg-green-50 text-green-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <f.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Tracker Preview */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Join 50,000+ Eco-Warriors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "E-Waste Collected", value: "1.2M kg" },
              { label: "CO2 Emissions Saved", value: "450k kg" },
              { label: "Trees Equivalent", value: "12,000" },
              { label: "Payouts Distributed", value: "₹2.5 Cr" }
            ].map((s, i) => (
              <div key={i}>
                <h4 className="text-3xl font-bold text-green-600">{s.value}</h4>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

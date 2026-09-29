import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldAlert, IndianRupee, PieChart } from 'lucide-react';

export default function SavingsCalculator({ onOpenBooking }) {
  const [selectedPlan, setSelectedPlan] = useState('single'); // 'single' | 'double' | 'daily'

  const comparisonData = {
    single: {
      title: 'Private Single Room',
      aafaTotal: 11499,
      flatTotal: 23200,
      pgTotal: 15500,
      savingsVsFlat: 11701,
      savingsVsPg: 4001,
      breakdown: [
        { item: 'Base Room Rent', aafa: '₹11,499', flat: '₹14,000', pg: '₹9,500' },
        { item: '3x Meals + Cook Salary', aafa: 'Included (₹0)', flat: '₹4,500 (Cook + Groceries)', pg: '₹3,500 (Outside Swiggy)' },
        { item: '1GBPS Wi-Fi Broadband', aafa: 'Included (₹0)', flat: '₹1,000', pg: '₹500 (Slow / Add-on)' },
        { item: '100% Gen Power & Utilities', aafa: 'Included (₹0)', flat: '₹1,500', pg: '₹500' },
        { item: 'Daily Maid Housekeeping', aafa: 'Included (₹0)', flat: '₹1,200', pg: '₹500' },
        { item: 'Building Maintenance', aafa: 'Included (₹0)', flat: '₹1,000', pg: '₹500' },
        { item: 'Upfront Security Deposit', aafa: '1 Month Refundable', flat: '6 - 10 Months (₹80K+)', pg: '2 - 3 Months Deposit' },
      ],
    },
    double: {
      title: 'Twin Sharing Room',
      aafaTotal: 7499,
      flatTotal: 14500,
      pgTotal: 10500,
      savingsVsFlat: 7001,
      savingsVsPg: 3001,
      breakdown: [
        { item: 'Base Bed Rent', aafa: '₹7,499', flat: '₹8,000', pg: '₹6,500' },
        { item: '3x Meals + Cook Salary', aafa: 'Included (₹0)', flat: '₹3,500 (Split Cook/Groceries)', pg: '₹2,500 (Outside Meals)' },
        { item: '1GBPS Wi-Fi Broadband', aafa: 'Included (₹0)', flat: '₹500', pg: '₹300' },
        { item: '100% Gen Power & Utilities', aafa: 'Included (₹0)', flat: '₹1,000', pg: '₹400' },
        { item: 'Daily Maid Housekeeping', aafa: 'Included (₹0)', flat: '₹800', pg: '₹400' },
        { item: 'Building Maintenance', aafa: 'Included (₹0)', flat: '₹700', pg: '₹400' },
        { item: 'Upfront Security Deposit', aafa: '1 Month Refundable', flat: '₹40,000+ Split Deposit', pg: '2 - 3 Months Deposit' },
      ],
    },
    daily: {
      title: 'Daily Stay (Short Trip / Trials)',
      aafaTotal: 499,
      flatTotal: 2200,
      pgTotal: 900,
      savingsVsFlat: 1701,
      savingsVsPg: 401,
      breakdown: [
        { item: 'Daily Stay Rate', aafa: '₹499 / day', flat: '₹2,200 (Hotel / Airbnb)', pg: '₹900 (Dorm PG)' },
        { item: 'Hot Kerala Breakfast', aafa: 'Included (₹0)', flat: '₹250 Extra', pg: 'Not Included' },
        { item: 'High Speed Fiber Wi-Fi', aafa: 'Included (₹0)', flat: 'Included', pg: 'Extra / Flaky' },
        { item: 'Security Deposit', aafa: 'Zero Deposit', flat: 'Full Advance Required', pg: 'Advance' },
      ],
    },
  };

  const current = comparisonData[selectedPlan];

  return (
    <section className="relative py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
          <TrendingUp className="w-4 h-4 text-[#D4A64A]" />
          <span>Real Monthly Financial Breakdown</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF7F0] mb-4 font-sora tracking-tight">
          Save up to <span className="text-gradient-emerald">₹11,700/mo</span> Living at Aafa
        </h2>
        <p className="text-[#FAF7F0]/80 text-sm sm:text-base leading-relaxed">
          No hidden grocery bills, no cook drama, no electricity surge charges, and zero inflated security deposits.
        </p>
      </div>

      {/* Plan Switcher Pills */}
      <div className="flex justify-center gap-2.5 mb-10 overflow-x-auto pb-2">
        {[
          { id: 'single', label: 'Single Executive Suite' },
          { id: 'double', label: 'Double Sharing Deluxe' },
          { id: 'daily', label: 'Daily Stay (₹499/day)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedPlan(tab.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedPlan === tab.id
                ? 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] shadow-lg shadow-[#D4A64A]/30 scale-105'
                : 'glass-card text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
            }`}
            data-cursor="expand"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3 Summary Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* AAFA COLIVING (Champion Card) */}
        <motion.div
          key={`aafa-${selectedPlan}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 sm:p-8 glass-card-glow border-2 border-[#D4A64A] relative overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] text-[10px] font-extrabold uppercase font-mono shadow-md">
            Best Value & Quality
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-[#D4A64A] font-bold">All-Inclusive Sanctuary</span>
            <h3 className="text-2xl font-extrabold text-[#FAF7F0] font-sora mt-1 mb-3">
              AAFA Coliving
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold text-[#D4A64A] font-sora">
                ₹{current.aafaTotal.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#FAF7F0]/60 font-mono">
                {selectedPlan === 'daily' ? '/ day' : '/ month'}
              </span>
            </div>
            <p className="text-xs text-emerald-300 font-semibold mb-6 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3x Kerala Meals + 1Gbps Wi-Fi + Power Backup Included</span>
            </p>
          </div>

          <button
            onClick={() => onOpenBooking(current.title)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] font-extrabold text-xs shadow-lg shadow-[#D4A64A]/30 hover:shadow-[#D4A64A]/50 transition-all flex items-center justify-center gap-2 btn-shimmer"
            data-cursor="expand"
          >
            <span>Lock-In This Rate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Traditional PG */}
        <motion.div
          key={`pg-${selectedPlan}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-3xl p-6 sm:p-8 glass-card border border-white/10 flex flex-col justify-between"
        >
          <div>
            <span className="text-xs font-mono uppercase text-[#FAF7F0]/60">Standard Rental</span>
            <h3 className="text-2xl font-bold text-[#FAF7F0] font-sora mt-1 mb-3">
              Traditional PG
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-[#FAF7F0]/80 font-sora">
                ₹{current.pgTotal.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#FAF7F0]/60 font-mono">
                {selectedPlan === 'daily' ? '/ day' : '/ month'}
              </span>
            </div>
            <p className="text-xs text-amber-300/80 mb-6 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Frequent outside food expenses due to poor menu quality</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-xs text-[#FAF7F0]/70">You save with Aafa:</span>
            <p className="text-lg font-bold text-emerald-400 font-sora">
              + ₹{current.savingsVsPg.toLocaleString('en-IN')} /mo
            </p>
          </div>
        </motion.div>

        {/* Renting an Independent Flat */}
        <motion.div
          key={`flat-${selectedPlan}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="rounded-3xl p-6 sm:p-8 glass-card border border-white/10 flex flex-col justify-between"
        >
          <div>
            <span className="text-xs font-mono uppercase text-[#FAF7F0]/60">Self-Managed Flat</span>
            <h3 className="text-2xl font-bold text-[#FAF7F0] font-sora mt-1 mb-3">
              Renting 1BHK / 2BHK
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-rose-400 font-sora">
                ₹{current.flatTotal.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#FAF7F0]/60 font-mono">
                {selectedPlan === 'daily' ? '/ day' : '/ month'}
              </span>
            </div>
            <p className="text-xs text-rose-300/80 mb-6 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>High ₹80k+ advance deposit + cook & maid management headaches</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
            <span className="text-xs text-emerald-300">Total Monthly Savings:</span>
            <p className="text-xl font-extrabold text-emerald-400 font-sora">
              + ₹{current.savingsVsFlat.toLocaleString('en-IN')} /mo
            </p>
          </div>
        </motion.div>

      </div>

      {/* Full Transparent Table Breakdown */}
      <div className="rounded-3xl glass-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-bold font-sora text-[#FAF7F0] flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#D4A64A]" />
            <span>Line-by-Line Cost Comparison</span>
          </h4>
          <span className="text-xs font-mono text-[#D4A64A]">Zero Hidden Surcharges</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono uppercase text-[#FAF7F0]/60 bg-[#0B1220]/60">
                <th className="p-4 pl-6">Expense Item</th>
                <th className="p-4 text-[#D4A64A] bg-[#D4A64A]/10 font-bold font-sora">AAFA Coliving</th>
                <th className="p-4 text-[#FAF7F0]/80">Traditional PG</th>
                <th className="p-4 text-[#FAF7F0]/80">Renting a Flat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {current.breakdown.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 font-medium text-[#FAF7F0]">{row.item}</td>
                  <td className="p-4 font-bold text-emerald-400 bg-[#D4A64A]/5">{row.aafa}</td>
                  <td className="p-4 text-[#FAF7F0]/60">{row.pg}</td>
                  <td className="p-4 text-[#FAF7F0]/60">{row.flat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}

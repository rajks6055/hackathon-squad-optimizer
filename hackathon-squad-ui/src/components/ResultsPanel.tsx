import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Zap } from 'lucide-react';
import type { OptimizationResult } from '../types';

interface ResultsPanelProps {
  result: OptimizationResult | null;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center border border-slate-800/50 rounded-2xl bg-slate-900/20 border-dashed">
        <p className="text-slate-500">Run optimization to view analytics</p>
      </div>
    );
  }

  // Animation variants for the stagger effect on the grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">Max Skill Score</span>
          </div>
          <div className="text-4xl font-bold text-white">{result.maxScore.toLocaleString()}</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Coders Selected</span>
          </div>
          <div className="text-4xl font-bold text-white">{result.totalSelected}</div>
        </motion.div>
      </div>

      {/* Optimization Curve */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-64">
        <h3 className="text-sm font-medium text-slate-400 mb-4">Algorithm Convergence</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={result.history}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Squad Grid */}
      <div className="flex-grow bg-slate-900/50 border border-slate-800 rounded-2xl p-6 overflow-hidden flex flex-col">
        <h3 className="text-sm font-medium text-slate-400 mb-4">Final Squad Composition</h3>
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {result.squad.map((coder) => (
              <motion.div key={coder.id} variants={itemVariants} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center hover:border-blue-500/50 transition-colors">
                <div className="text-xs text-slate-500 mb-1">ID: {coder.id}</div>
                <div className="font-semibold text-blue-400">{coder.rating}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
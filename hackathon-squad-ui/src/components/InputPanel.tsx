import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, Loader2 } from 'lucide-react';

interface InputPanelProps {
  onRunOptimization: (data: string) => void;
  isOptimizing: boolean;
}

export default function InputPanel({ onRunOptimization, isOptimizing }: InputPanelProps) {
  const [inputData, setInputData] = useState('');

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Dataset Input</h2>
        <p className="text-slate-400 text-sm">Paste your N, M, skill arrays, and conflict pairs here.</p>
      </div>

      <textarea
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder="5 3\n100 85 120 90 110\n1 2\n2 3\n4 5"
        className="flex-grow w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
        disabled={isOptimizing}
      />

      <motion.button
        whileHover={!isOptimizing ? { scale: 1.02 } : {}}
        whileTap={!isOptimizing ? { scale: 0.98 } : {}}
        onClick={() => onRunOptimization(inputData)}
        disabled={isOptimizing}
        className={`mt-6 w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
          isOptimizing 
            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
        }`}
      >
        {isOptimizing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Optimizing Dataset...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Run Optimization
          </>
        )}
      </motion.button>
    </div>
  );
}
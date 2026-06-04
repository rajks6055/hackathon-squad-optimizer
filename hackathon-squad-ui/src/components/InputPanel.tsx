import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, Loader2 } from 'lucide-react';

interface InputPanelProps {
  onRunOptimization: (data: string) => void;
  isOptimizing: boolean;
}

export default function InputPanel({ onRunOptimization, isOptimizing }: InputPanelProps) {
  const [inputData, setInputData] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        alert("Invalid file type. Please upload a .json file.");
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const result = e.target?.result as string;
            const json = JSON.parse(result);

            if (typeof json.n !== 'number' || typeof json.m !== 'number' || !Array.isArray(json.skills) || !Array.isArray(json.edges)) {
                 throw new Error("Missing required fields: n, m, skills, or edges.");
            }

            let formattedText = `${json.n} ${json.m}\n`;
            formattedText += json.skills.join(" ") + "\n";
            json.edges.forEach((edge: number[]) => {
                formattedText += `${edge[0]} ${edge[1]}\n`;
            });

            setInputData(formattedText);
        } catch (error: any) {
            alert("Error parsing JSON: " + error.message);
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-2">Dataset Input</h2>
        
        <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Paste raw text, or upload a formatted JSON.</span>
            
            <input 
                type="file" 
                id="json-upload" 
                accept=".json" 
                onChange={handleFileUpload} 
                className="hidden" 
                disabled={isOptimizing}
            />
            
            <label 
                htmlFor="json-upload" 
                className={`flex items-center gap-2 cursor-pointer text-sm text-slate-400 hover:text-blue-400 border border-slate-700 hover:border-blue-500 rounded-lg px-3 py-1.5 transition-colors duration-200 ${isOptimizing ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <Upload className="w-4 h-4" />
                Upload .json
            </label>
        </div>

        {/* NEW: The JSON Format Hint Block */}
        <div className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1.5 font-medium">Expected JSON Format:</p>
          <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap">
{`{
  "n": 5, "m": 3,
  "skills": [100, 85, 120, 90, 110],
  "edges": [[1, 2], [2, 3], [4, 5]]
}`}
          </pre>
        </div>
      </div>

      <textarea
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder="5 3\n100 85 120 90 110\n1 2\n2 3\n4 5"
        className="flex-grow w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all mt-2"
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
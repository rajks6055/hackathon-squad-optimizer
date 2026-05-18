import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import type { OptimizationResult, Coder } from './types';

function App() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  // MOCK: Simulates the C++ backend crunching numbers for a few seconds
  const handleRunOptimization = async (data: string) => {
    setIsOptimizing(true);
    setResult(null);

    try {
      // Send the raw text data to our Node.js backend
      const response = await fetch('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Telling the server to expect raw text
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Parse the JSON returned by the C++ engine via Node
      const jsonResult = await response.json();
      
      // Update our dashboard with the real data!
      setResult(jsonResult);
    } catch (error) {
      console.error("Failed to run optimization:", error);
      alert("Error connecting to the backend. Is your Node.js server running on port 3000?");
    } finally {
      setIsOptimizing(false); // Stop the loading spinner
    }
  };
  return (
    <div className="min-h-screen flex flex-col p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <Activity className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Hackathon Squad Optimizer</h1>
          <p className="text-sm text-slate-400">Maximum Weight Independent Set Solver</p>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
        <div className="lg:col-span-4 h-full">
          <InputPanel 
            onRunOptimization={handleRunOptimization} 
            isOptimizing={isOptimizing} 
          />
        </div>
        <div className="lg:col-span-8 h-full">
          <ResultsPanel result={result} />
        </div>
      </main>
    </div>
  );
}

export default App;
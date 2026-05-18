export interface Coder {
  id: number;
  rating: number;
}

export interface OptimizationResult {
  maxScore: number;
  totalSelected: number;
  squad: Coder[];
  history: { time: number; score: number }[];
}
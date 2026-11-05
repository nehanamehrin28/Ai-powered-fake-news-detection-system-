export type PredictionType = 'Likely Real News' | 'Potentially Fake News';

export type InputMode = 'headline' | 'article' | 'url';

export interface LinguisticMarker {
  term: string;
  weight: number;
  type: 'suspicious' | 'credible' | 'neutral';
  explanation: string;
}

export interface LinguisticDiagnostics {
  subjectivityScore: number; // 0 - 100%
  sensationalismIndex: number; // 0 - 100%
  syntacticComplexity: string; // 'Low' | 'Moderate' | 'High'
  readingGradeLevel: string; // e.g. 'College Level', 'High School'
  emotionalTone: 'Neutral / Informative' | 'Sensational / Urgent' | 'Inflammatory' | 'Objective';
  keyMarkers: LinguisticMarker[];
  wordCount: number;
  detectedLanguage: string;
}

export interface AnalysisResult {
  id: string;
  title: string;
  originalText: string;
  inputMode: InputMode;
  url?: string;
  prediction: PredictionType;
  confidenceScore: number; // 0 to 100%
  timestamp: string;
  modelAlgorithm: string;
  diagnostics: LinguisticDiagnostics;
  limitationsNotice: string;
  verificationAdvice: string[];
  userId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  institution?: string;
  createdAt: string;
  avatarSeed?: string;
}

export interface AnalysisStats {
  totalAnalyzed: number;
  realCount: number;
  fakeCount: number;
  averageConfidence: number;
  todayCount: number;
  urlCount: number;
  headlineCount: number;
  articleCount: number;
}

export interface ModelMetrics {
  algorithm: string;
  vectorizer: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalTrainingSamples: number;
  datasetName: string;
  lastTrained: string;
  version: string;
  hyperparameters: {
    C: number;
    maxIter: number;
    loss: string;
    ngramRange: string;
    maxFeatures: number;
  };
}

export interface ProjectCodeFile {
  filename: string;
  language: string;
  description: string;
  category: 'backend' | 'ml' | 'database' | 'frontend' | 'docs';
  code: string;
}

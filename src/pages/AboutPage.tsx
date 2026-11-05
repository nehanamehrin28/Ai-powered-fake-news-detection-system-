import React from 'react';
import { 
  Target, 
  Layers, 
  Cpu, 
  AlertTriangle, 
  BookOpen, 
  ShieldCheck, 
  Code2, 
  Award,
  ExternalLink
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
          <Award className="w-3.5 h-3.5" />
          <span>B.Tech Final Year Academic Capstone</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About TruthScan & Algorithmic Foundation
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          TruthScan was conceptualized and developed as an engineering endeavor to counter the exponential proliferation of digital disinformation, clickbait manipulations, and uncorroborated social media falsehoods using Natural Language Processing.
        </p>
      </div>

      {/* Project Objectives */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Target className="w-5 h-5 text-blue-600" />
          <h2>1. Core Project Objectives</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-800">Rapid Multi-Modal Ingestion</h3>
            <p>
              Enable immediate evaluation of short viral claims (headlines), long-form investigative reports, and web links via safe server-side extraction.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-800">Explainable AI Signals</h3>
            <p>
              Prevent "black-box" conclusions by presenting concrete lexical indicators, subjective polarity scores, and readability grade levels alongside confidence percentages.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-800">Stream-Adapted Online Learning</h3>
            <p>
              Leverage the Passive-Aggressive formulation which adapts to fast-evolving misinformation styles without full retraining cycles.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-800">Responsible AI Ethics</h3>
            <p>
              Emphasize transparency by mandating prominent advisory notices stating that NLP statistical scores are probabilistic aids rather than judicial truth arbiters.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Code2 className="w-5 h-5 text-indigo-600" />
          <h2>2. Technology Stack & Frameworks</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 border border-slate-200 rounded-lg space-y-2">
            <span className="font-bold text-slate-900 block">Frontend Interface</span>
            <p className="text-slate-600">
              React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and Motion for modern, responsive visual analytics.
            </p>
          </div>
          <div className="p-4 border border-slate-200 rounded-lg space-y-2">
            <span className="font-bold text-slate-900 block">Backend REST API</span>
            <p className="text-slate-600">
              Python 3.10 with Flask, CORS, BeautifulSoup4 for web scraping, and Express server for edge routing.
            </p>
          </div>
          <div className="p-4 border border-slate-200 rounded-lg space-y-2">
            <span className="font-bold text-slate-900 block">Machine Learning & NLP</span>
            <p className="text-slate-600">
              Scikit-learn TfidfVectorizer (n-grams 1-2, sublinear scaling), PassiveAggressiveClassifier, Joblib model persistence.
            </p>
          </div>
          <div className="p-4 border border-slate-200 rounded-lg space-y-2">
            <span className="font-bold text-slate-900 block">Database Storage</span>
            <p className="text-slate-600">
              SQLite relational database schema with indexed queries for audit logs, user records, and diagnostic persistence.
            </p>
          </div>
        </div>
      </div>

      {/* Mathematical Principle: Passive-Aggressive Classifier */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Cpu className="w-5 h-5 text-blue-600" />
          <h2>3. Working Principle: Passive-Aggressive Classifier (PAC)</h2>
        </div>

        <div className="text-xs text-slate-600 space-y-4 leading-relaxed">
          <p>
            The Passive-Aggressive algorithm is a family of online learning algorithms for large-scale margin-based classification. Unlike standard batch-trained linear models or stochastic gradient descent, PAC updates its weight vector only when a training example violates the margin requirement.
          </p>

          <div className="p-4 bg-slate-950 text-slate-100 rounded-lg font-mono space-y-3">
            <div className="text-blue-400 font-bold">1. Hinge Loss Formulation:</div>
            <div className="text-slate-300">
              L(w; (x, y)) = 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if y · (w · x) &ge; 1 (Passive)
              <br />
              L(w; (x, y)) = 1 - y · (w · x) &nbsp;&nbsp; otherwise &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Aggressive)
            </div>

            <div className="text-indigo-400 font-bold pt-2">2. Closed-Form Weight Update:</div>
            <div className="text-slate-300">
              w_(t+1) = w_t + sign(y_t) · &tau;_t · x_t
              <br />
              where &tau;_t = min(C, L_t / ||x_t||&sup2;)
            </div>

            <div className="text-emerald-400 font-bold pt-2">3. Platt Sigmoid Confidence Calibration:</div>
            <div className="text-slate-300">
              P(y = 1 | x) = 1 / (1 + exp(-0.45 · (w · x + b)))
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">Why PAC outperforms traditional classifiers on news streams:</h4>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
              <li><strong>Zero-Overhead Memory Footprint:</strong> Does not require storing all prior vectors in memory.</li>
              <li><strong>Resilience to Linguistic Drift:</strong> Fast adaptation when deceptive sources coin new trigger terms.</li>
              <li><strong>Sparsity Handling:</strong> High computational efficiency across sparse TF-IDF matrices (5,000+ dimensions).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Limitations and Ethical Guidelines */}
      <div className="bg-amber-50/60 p-6 sm:p-8 rounded-xl border border-amber-200 space-y-4">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2>4. Critical Limitations & Responsible AI Guidelines</h2>
        </div>

        <div className="text-xs text-amber-900/90 space-y-3 leading-relaxed">
          <p>
            Users and evaluators must understand that statistical machine learning analyzes stylistic, structural, and semantic word associations—not ontological objective truth.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Satire and Parody:</strong> Satirical publications (e.g. The Onion) intentionally mimic authentic journalistic grammar; models may classify them as real if vocabulary resembles standard wire reports.</li>
            <li><strong>Breaking Unprecedented Events:</strong> Genuine, historic breaking news containing extraordinary phrases may trigger high sensationalism flags due to uncharacteristic urgency.</li>
            <li><strong>Cross-Language Differences:</strong> Regional nuances and translated vernaculars require continuous expansion of multilingual corpora.</li>
            <li><strong>Strict Prohibition on Autonomous Censorship:</strong> TruthScan is an auxiliary analytical tool and must never be utilized as an automated gatekeeper to censor or suppress content without human editorial review.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

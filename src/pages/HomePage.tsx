import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  BarChart3, 
  FileText, 
  Globe2, 
  Lock,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  onStartAnalysis: (initialText?: string) => void;
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartAnalysis, setActiveTab }) => {
  const [quickInput, setQuickInput] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onStartAnalysis(quickInput.trim());
    } else {
      setActiveTab('detect');
    }
  };

  const sampleHeadlines = [
    {
      text: "Reuters: Central banks coordinate liquidity lines to ensure financial market stability.",
      type: "Credible Example"
    },
    {
      text: "SHOCKING BOMBSHELL: Banned fruit discovered that instantly cures all autoimmune conditions!",
      type: "Sensationalist Example"
    }
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and Primary CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TF-IDF & Passive Aggressive NLP Classifier</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] text-balance">
                Don’t Believe Everything You Read. <span className="text-blue-600">Verify It.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                TruthScan is an AI-driven verification platform engineered to detect potentially deceptive headlines, manipulative narratives, and fabricated news articles in seconds using Natural Language Processing.
              </p>

              {/* Quick Input Bar */}
              <form onSubmit={handleQuickSubmit} className="pt-2">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="Enter a news headline, article excerpt, or web URL..."
                    className="flex-1 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Analyse News</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Instant Try-Me Samples */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Try sample:</span>
                  {sampleHeadlines.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onStartAnalysis(sample.text)}
                      className="text-left text-blue-600 hover:text-blue-800 hover:underline max-w-[280px] sm:max-w-xs truncate cursor-pointer"
                      title={sample.text}
                    >
                      "{sample.text}"
                    </button>
                  ))}
                </div>
              </form>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>93.8% Benchmark Accuracy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>SSRF-Safe URL Fetching</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-600" />
                  <span>Full Linguistic Breakdown</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Anchor */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900 group">
                <img
                  src="/src/assets/images/hero_news_verification_1793894743580.jpg"
                  alt="Newsroom editorial verification workspace with digital analytics overlay"
                  className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-1">
                    Fact-Checking Laboratory
                  </span>
                  <p className="text-sm font-medium text-slate-200">
                    Real-time feature vectorization against international disinformation corpuses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Architectural Pipeline
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How TruthScan Evaluates Credibility
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              From raw text ingestion to hyper-plane classification, each claim undergoes rigorous computational linguistics evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base border border-blue-100">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Text Preprocessing & TF-IDF
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Removes syntactic noise, normalizes unicode (including Malayalam characters), strips stopwords, and extracts unigrams and bigrams weighted by Inverse Document Frequency.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                idf(t) = log((1+N)/(1+df(t))) + 1
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base border border-indigo-100">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Passive Aggressive Classification
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies an online margin-based algorithm that updates decision bounds aggressively on prediction errors while remaining passive when verified claims meet margin tolerance.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                loss = max(0, 1 - y · (w · x))
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base border border-emerald-100">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Confidence & Diagnostics
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calibrates raw decision scores via Platt sigmoid scaling to output bounded confidence percentages alongside subjectivity, sensationalism, and key trigger words.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                P(y=1) = 1 / (1 + e^(-k·margin))
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
            System Features
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive Verification Toolkit
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Designed for journalists, students, researchers, and academic evaluators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">3 Input Modalities</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify short viral headlines, paste full-length multi-paragraph investigative reports, or extract directly from online news URLs.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">Explainable AI Signals</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect exactly which lexical tokens, sensationalist buzzwords, or wire attributions influenced the classification margin.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">SSRF-Protected Scraper</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hardened URL retrieval that blocks loopback networks, internal cloud metadata, and malicious host redirections.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">Multilingual Scope</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineered with foundational English models and extensible unicode support for regional Indian languages like Malayalam.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">User Dashboard & Charts</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track verification trends over time, monitor distribution ratios of authentic versus manipulated content, and review logs.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">Exportable Academic Kit</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Includes full Flask backend, Scikit-learn training script, dataset samples, and SQLite schema ready for viva examination.
            </p>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="p-8 sm:p-10 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to verify a news story?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Submit any headline or article into the TruthScan neural pipeline right now.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('detect')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            Launch News Detector
          </button>
        </div>
      </section>
    </div>
  );
};

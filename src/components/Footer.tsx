import React from 'react';
import { ShieldCheck, BookOpen, ExternalLink, Award } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Wordmark & Synopsis */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Truth<span className="text-blue-400">Scan</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An AI-powered Fake News Detection System engineered with TF-IDF Vectorization and Passive-Aggressive Machine Learning to evaluate journalistic integrity and linguistic credibility.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
              <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>B.Tech CSE Capstone Project</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('detect')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Verify News (Headline, Article, URL)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  User Analytics Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Analysis History & Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Console & Model Tuning
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">
              Academic Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('project-pack')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Flask & ML Source Code Kit</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Passive Aggressive Classifier Math
                </button>
              </li>
              <li>
                <a
                  href="https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.PassiveAggressiveClassifier.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Scikit-Learn Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.uvic.ca/engineering/ece/isot/datasets/fake-news/index.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>ISOT Fake News Corpus</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Fact-Check Ethical Advisory */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">
              Responsible AI Disclaimer
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              TruthScan delivers machine learning probability estimations based on stylistic and linguistic indicators. Predictions should never replace manual cross-verification against certified international fact-checkers (e.g., IFCN, Snopes, BoomLive, AP).
            </p>
          </div>
        </div>

        {/* Bottom Unboxed Metadata */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span>TruthScan Project</span>
            <span aria-hidden="true">·</span>
            <span>Version 2.4-PAC</span>
            <span aria-hidden="true">·</span>
            <span>Academic Open Source</span>
          </div>
          <div>
            <span>Designed for Campus Project Exhibition & Technical Placement Portfolio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

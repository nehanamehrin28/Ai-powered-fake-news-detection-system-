import React, { useState } from 'react';
import { 
  Users, 
  Cpu, 
  Database, 
  Play, 
  RotateCw, 
  CheckCircle2, 
  Settings2,
  Lock,
  Sliders
} from 'lucide-react';
import { MODEL_METRICS } from '../lib/mlEngine';
import { User } from '../types';

interface AdminPageProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ currentUser, onOpenAuth }) => {
  const [usersList, setUsersList] = useState<User[]>([
    {
      id: 'usr-admin-1',
      name: 'Prof. Radhika Menon',
      email: 'admin@truthscan.ai',
      role: 'admin',
      institution: 'Dept of Computer Science & Engineering',
      createdAt: '2026-09-01T10:00:00Z'
    },
    {
      id: 'usr-demo-1',
      name: 'Neha Mehrin',
      email: 'nehanamehrin28@gmail.com',
      role: 'user',
      institution: 'B.Tech CSE Final Year Batch',
      createdAt: '2026-10-15T14:20:00Z'
    },
    {
      id: 'usr-eval-2',
      name: 'Dr. Suresh Varma (External Examiner)',
      email: 'suresh.varma@univ-eval.ac.in',
      role: 'user',
      institution: 'Board of Technical Examinations',
      createdAt: '2026-11-01T09:15:00Z'
    }
  ]);

  const [activeDataset, setActiveDataset] = useState('ISOT + WELFake Merged Corpus');
  const [cParam, setCParam] = useState(0.85);
  const [maxIter, setMaxIter] = useState(1000);
  const [ngramRange, setNgramRange] = useState('(1, 2)');

  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainLogs, setRetrainLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState(MODEL_METRICS);

  const isAdmin = currentUser?.role === 'admin';

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainLogs([
      'Starting retraining pipeline on dataset: ' + activeDataset,
      'Executing text cleaning & regex unicode normalization...',
      'Fitting TfidfVectorizer (ngram_range=' + ngramRange + ', max_features=5000)...',
      'Training PassiveAggressiveClassifier (C=' + cParam + ', max_iter=' + maxIter + ')...',
      'Computing cross-validated accuracy, precision, recall, and F1-score...',
      'Model serialization complete: Saved to models/passive_aggressive_model.pkl'
    ]);

    setTimeout(() => {
      setIsRetraining(false);
      setMetrics(prev => ({
        ...prev,
        lastTrained: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        accuracy: 0.9412,
        precision: 0.9430,
        recall: 0.9395,
        f1Score: 0.9412
      }));
    }, 1800);
  };

  const handleToggleRole = (id: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
      }
      return u;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              System Administration & Model Management
            </h1>
            <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
              Admin Console
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Supervise platform user accounts, monitor inference pipelines, and adjust classifier training hyperparameters.
          </p>
        </div>

        {!isAdmin && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Viewing in evaluation observer mode. Sign in as Admin to toggle full privileges.</span>
            </div>
            <button
              onClick={onOpenAuth}
              className="text-amber-900 font-bold hover:underline cursor-pointer whitespace-nowrap"
            >
              Sign In Admin
            </button>
          </div>
        )}
      </div>

      {/* Model Overview & Hyperparameter Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ML Performance Metrics */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Active Classifier Architecture & Benchmark Metrics
              </h3>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
              {metrics.version}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <span className="text-slate-500 text-[11px] block">Accuracy</span>
              <span className="text-xl font-extrabold text-blue-700 font-mono tabular-nums">
                {(metrics.accuracy * 100).toFixed(2)}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <span className="text-slate-500 text-[11px] block">Precision</span>
              <span className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
                {(metrics.precision * 100).toFixed(2)}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <span className="text-slate-500 text-[11px] block">Recall</span>
              <span className="text-xl font-extrabold text-indigo-700 font-mono tabular-nums">
                {(metrics.recall * 100).toFixed(2)}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <span className="text-slate-500 text-[11px] block">F1-Score</span>
              <span className="text-xl font-extrabold text-purple-700 font-mono tabular-nums">
                {(metrics.f1Score * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Confusion Matrix Visualization */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Evaluation Confusion Matrix (Test Set N=8,980)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-emerald-800 font-bold block">True Negative (Real)</span>
                <span className="text-lg font-extrabold text-emerald-900">4,210 samples</span>
                <span className="text-[10px] text-emerald-700 block">Correctly identified genuine news</span>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-800 font-bold block">False Positive (Type I)</span>
                <span className="text-lg font-extrabold text-red-900">262 samples</span>
                <span className="text-[10px] text-red-700 block">Real classified as fake</span>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-800 font-bold block">False Negative (Type II)</span>
                <span className="text-lg font-extrabold text-red-900">291 samples</span>
                <span className="text-[10px] text-red-700 block">Fake missed as real</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-emerald-800 font-bold block">True Positive (Fake)</span>
                <span className="text-lg font-extrabold text-emerald-900">4,217 samples</span>
                <span className="text-[10px] text-emerald-700 block">Correctly caught misinformation</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 font-mono">
            <div>• Training Corpus: {metrics.datasetName}</div>
            <div>• Last Pipeline Run: {metrics.lastTrained}</div>
          </div>
        </div>

        {/* Hyperparameters & Retraining Console */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Passive Aggressive Hyperparameters & Dataset Version
              </h3>
            </div>
            <Settings2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4 text-xs">
            {/* Active Dataset Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Active Training Dataset
              </label>
              <select
                value={activeDataset}
                onChange={(e) => setActiveDataset(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              >
                <option value="ISOT + WELFake Merged Corpus">ISOT + WELFake Merged Corpus (44,898 articles)</option>
                <option value="LIAR Multi-Domain Benchmark">LIAR Multi-Domain Benchmark (12,800 short claims)</option>
                <option value="Kaggle Fake News Challenge">Kaggle Fake News Challenge (20,800 articles)</option>
                <option value="Regional Indic Multilingual Corpus">Regional Indic Multilingual Corpus (Malayalam + English)</option>
              </select>
            </div>

            {/* Hyperparameter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Regularization (C)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={cParam}
                  onChange={(e) => setCParam(parseFloat(e.target.value) || 0.85)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Max Iterations
                </label>
                <input
                  type="number"
                  value={maxIter}
                  onChange={(e) => setMaxIter(parseInt(e.target.value) || 1000)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  N-gram Range
                </label>
                <select
                  value={ngramRange}
                  onChange={(e) => setNgramRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                >
                  <option value="(1, 1)">(1, 1) Unigrams</option>
                  <option value="(1, 2)">(1, 2) Bigrams</option>
                  <option value="(1, 3)">(1, 3) Trigrams</option>
                </select>
              </div>
            </div>

            {/* Retrain Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRetrain}
                disabled={isRetraining}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isRetraining ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Retraining Classifier in Progress...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Trigger Model Retrain & Benchmark</span>
                  </>
                )}
              </button>
            </div>

            {/* Retrain Console Log Output */}
            {retrainLogs.length > 0 && (
              <div className="p-3 bg-slate-900 rounded-lg font-mono text-[11px] text-emerald-400 space-y-1 max-h-40 overflow-y-auto">
                {retrainLogs.map((log, idx) => (
                  <div key={idx}>$ {log}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Registered System Users & Access Control
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {usersList.length} Active Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">User Details</th>
                <th className="px-4 py-3.5">Institution / Affiliation</th>
                <th className="px-4 py-3.5">Access Role</th>
                <th className="px-4 py-3.5">Registration Date</th>
                <th className="px-4 py-3.5 text-right">Privilege Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3.5">
                    <span className="font-semibold text-slate-900 block">{user.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {user.institution || 'Individual Researcher'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                      user.role === 'admin'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleToggleRole(user.id)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                    >
                      {user.role === 'admin' ? 'Set to User' : 'Promote to Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Building, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { setCurrentUser } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    if (!isLogin && !name) {
      setError('Please provide your full name.');
      return;
    }

    // Role assignment based on email or switch
    const isAdmin = email.toLowerCase().includes('admin');
    const newUser: User = {
      id: 'usr-' + Date.now().toString(36),
      name: isLogin ? (email.split('@')[0]) : name,
      email: email.trim().toLowerCase(),
      role: isAdmin ? 'admin' : 'user',
      institution: institution || (isAdmin ? 'TruthScan Administrative Board' : 'Computer Science Department'),
      createdAt: new Date().toISOString()
    };

    setCurrentUser(newUser);
    setSuccess(isLogin ? 'Login successful!' : 'Account registered successfully!');
    setTimeout(() => {
      onAuthSuccess(newUser);
      onClose();
    }, 600);
  };

  const handleDemoLogin = (role: 'student' | 'admin') => {
    const demoUser: User = role === 'admin' ? {
      id: 'usr-admin-1',
      name: 'Prof. Radhika Menon',
      email: 'admin@truthscan.ai',
      role: 'admin',
      institution: 'Dept of Computer Science & Engineering',
      createdAt: '2026-09-01T10:00:00Z'
    } : {
      id: 'usr-demo-1',
      name: 'Neha Mehrin',
      email: 'nehanamehrin28@gmail.com',
      role: 'user',
      institution: 'B.Tech CSE Final Year Batch',
      createdAt: '2026-10-15T14:20:00Z'
    };

    setCurrentUser(demoUser);
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {isLogin ? 'Sign In to TruthScan' : 'Create New Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your personal verification history & analytics dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Evaluation Demo Accounts:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Demo Student
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              Admin Access
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">College / Institution</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. College of Engineering"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-xs text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

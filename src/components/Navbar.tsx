import React from 'react';
import { ShieldCheck, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'detect', label: 'Verify News' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'History' },
    { id: 'admin', label: 'Admin' },
    { id: 'project-pack', label: 'College Kit' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-left cursor-pointer group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Truth<span className="text-blue-600">Scan</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm ${
                activeTab === link.id
                  ? 'text-blue-600 border-blue-600 font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
                title={currentUser.email}
              >
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Account Login</span>
            </button>
          )}

          {/* Mobile menu trigger buttons */}
          <div className="md:hidden flex items-center">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              {navLinks.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

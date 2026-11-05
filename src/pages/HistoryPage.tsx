import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { AnalysisResult, User } from '../types';
import { getHistory, deleteHistoryRecord, clearAllHistory } from '../lib/api';

interface HistoryPageProps {
  currentUser: User | null;
  onNavigateToDetect: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ currentUser, onNavigateToDetect }) => {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'real' | 'fake'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'headline' | 'article' | 'url'>('all');
  const [selectedRecord, setSelectedRecord] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    setIsLoading(true);
    const userId = currentUser?.id;
    const items = await getHistory(userId);
    setHistory(items);
    setIsLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this analysis record?')) {
      await deleteHistoryRecord(id);
      setHistory(prev => prev.filter(x => x.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear your entire verification history? This cannot be undone.')) {
      await clearAllHistory(currentUser?.id);
      setHistory([]);
      setSelectedRecord(null);
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Title', 'InputMode', 'Prediction', 'Confidence', 'Subjectivity', 'Sensationalism'];
    const rows = history.map(item => [
      item.id,
      item.timestamp,
      `"${item.title.replace(/"/g, '""')}"`,
      item.inputMode,
      item.prediction,
      item.confidenceScore,
      item.diagnostics.subjectivityScore,
      item.diagnostics.sensationalismIndex
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `truthscan-history-export-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.originalText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'real' 
        ? item.prediction === 'Likely Real News' 
        : item.prediction === 'Potentially Fake News';
    const matchesMode = modeFilter === 'all' ? true : item.inputMode === modeFilter;
    return matchesSearch && matchesStatus && matchesMode;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-4">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Analysis History Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Audit previously evaluated articles, inspect linguistic signals, and export forensic verification records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified articles by headline keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('real')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'real' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Likely Real
            </button>
            <button
              onClick={() => setStatusFilter('fake')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'fake' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Potentially Fake
            </button>
          </div>

          {/* Mode Filter */}
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Modes</option>
            <option value="headline">Headlines</option>
            <option value="article">Full Articles</option>
            <option value="url">URLs</option>
          </select>
        </div>
      </div>

      {/* History Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Verified Article Headline</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5">Mode</th>
                  <th className="px-4 py-3.5">Classification</th>
                  <th className="px-4 py-3.5 text-right">Confidence</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 max-w-md">
                      <span className="font-semibold text-slate-900 block truncate" title={item.title}>
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">
                        {item.originalText}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono uppercase text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.inputMode}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 font-semibold ${
                        item.prediction === 'Likely Real News' ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {item.prediction === 'Likely Real News' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        <span>{item.prediction}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-bold tabular-nums">
                      {item.confidenceScore.toFixed(1)}%
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedRecord(item); }}
                          className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                          title="View Full Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-4">
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all' || modeFilter !== 'all'
                ? 'No analysis records match your active search filter.'
                : 'No historical verification logs recorded yet. Run your first analysis to store records here.'}
            </p>
            <button
              onClick={onNavigateToDetect}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Verify News Now
            </button>
          </div>
        )}
      </div>

      {/* Inspect Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="space-y-1">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                  selectedRecord.prediction === 'Likely Real News' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedRecord.prediction}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedRecord.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Confidence</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {selectedRecord.confidenceScore.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mode</span>
                  <span className="font-bold text-slate-900 font-mono text-sm uppercase">
                    {selectedRecord.inputMode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Language</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedRecord.diagnostics.detectedLanguage}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date</span>
                  <span className="font-mono text-slate-700 text-[11px]">
                    {new Date(selectedRecord.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Full Original Content */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Full Text Excerpt
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-slate-700 leading-relaxed font-sans max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedRecord.originalText}
                </div>
              </div>

              {/* Predictive Tokens */}
              {selectedRecord.diagnostics.keyMarkers.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Key Predictive Tokens Identified by Model
                  </h4>
                  <div className="space-y-1.5">
                    {selectedRecord.diagnostics.keyMarkers.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-mono font-semibold text-slate-900">"{m.term}"</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">{m.explanation}</span>
                          <span className="font-mono font-bold text-slate-700">
                            {m.weight > 0 ? '+' : ''}{m.weight.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Limitations Notice */}
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/60 text-slate-600">
                <span className="font-bold text-blue-900 block mb-1">Algorithmic Notice:</span>
                {selectedRecord.limitationsNotice}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

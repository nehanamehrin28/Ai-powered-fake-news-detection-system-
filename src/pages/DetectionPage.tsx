import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Type, 
  FileText, 
  Link as LinkIcon, 
  RotateCcw, 
  Download, 
  Info,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { AnalysisResult, InputMode } from '../types';
import { analyzeNews, extractUrlContent } from '../lib/api';
import confetti from 'canvas-confetti';

interface DetectionPageProps {
  initialText?: string;
  onAnalysisSaved?: (result: AnalysisResult) => void;
}

export const DetectionPage: React.FC<DetectionPageProps> = ({ initialText, onAnalysisSaved }) => {
  const [mode, setMode] = useState<InputMode>('headline');
  const [headline, setHeadline] = useState(initialText || '');
  const [articleContent, setArticleContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (initialText) {
      setHeadline(initialText);
      setMode('headline');
    }
  }, [initialText]);

  // Preset benchmarks for instant testing
  const presets = [
    {
      label: 'Genuine Wire Report (Reuters)',
      mode: 'article' as InputMode,
      title: 'Global Renewable Energy Investments Surge in Q3',
      content: 'According to an official statement released by the International Energy Agency spokesperson on Tuesday, global capital deployment into solar and wind infrastructure increased by 14 percent year-over-year. Government ministries confirmed that policy incentives and supply chain normalization stabilized procurement costs across European and Asian markets, researchers reported in their quarterly fiscal survey.'
    },
    {
      label: 'Fabricated Miracle Health Claim',
      mode: 'headline' as InputMode,
      title: 'Banned Miracle Fruit Cures Diabetes',
      content: 'SHOCKING BOMBSHELL: Mainstream doctors don’t want you to know about this secret miracle fruit that was banned from television and completely cures diabetes in 72 hours! Urgent share before deleted!'
    },
    {
      label: 'Official Government Communication',
      mode: 'headline' as InputMode,
      title: 'Ministry Official Statement on Highways',
      content: 'Official statement from the Ministry of Road Transport confirmed that modern toll collection protocols will become active starting next month following parliamentary approval.'
    },
    {
      label: 'Malayalam Regional Sample (മലയാളം)',
      mode: 'headline' as InputMode,
      title: 'Malayalam Official Health Report',
      content: 'സംസ്ഥാനത്ത് ആരോഗ്യ വകുപ്പ് പുതിയ മാർഗ്ഗനിർദ്ദേശങ്ങൾ പുറപ്പെടുവിച്ചതായി മന്ത്രി ഔദ്യോഗിക വാർത്താക്കുറിപ്പിൽ അറിയിച്ചു.'
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setMode(preset.mode);
    setErrorMessage(null);
    if (preset.mode === 'headline') {
      setHeadline(preset.content);
    } else if (preset.mode === 'article') {
      setArticleContent(preset.content);
    }
  };

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setResult(null);

    let contentToAnalyze = '';
    let analysisUrl: string | undefined = undefined;
    let titleToAnalyze = '';

    if (mode === 'headline') {
      contentToAnalyze = headline.trim();
      titleToAnalyze = headline.trim();
      if (!contentToAnalyze) {
        setErrorMessage('Please enter a headline to analyze.');
        return;
      }
    } else if (mode === 'article') {
      contentToAnalyze = articleContent.trim();
      titleToAnalyze = articleContent.slice(0, 80) + '...';
      if (!contentToAnalyze) {
        setErrorMessage('Please paste the news article body.');
        return;
      }
    } else if (mode === 'url') {
      const cleanUrl = urlInput.trim();
      if (!cleanUrl) {
        setErrorMessage('Please provide a valid news URL.');
        return;
      }
      setIsAnalyzing(true);
      setAnalysisStatus('Connecting to source URL and verifying domain safety...');
      try {
        const extracted = await extractUrlContent(cleanUrl);
        contentToAnalyze = extracted.text;
        titleToAnalyze = extracted.title;
        analysisUrl = cleanUrl;
      } catch (err: any) {
        setIsAnalyzing(false);
        setErrorMessage(err.message || 'Failed to extract text from URL. Ensure the URL is accessible.');
        return;
      }
    }

    setIsAnalyzing(true);
    setAnalysisStatus('Tokenizing linguistic tokens and removing stopwords...');
    
    // Simulate real NLP pipeline steps
    setTimeout(async () => {
      setAnalysisStatus('Computing TF-IDF feature vectors and n-grams...');
      setTimeout(async () => {
        setAnalysisStatus('Evaluating Passive-Aggressive hyperplane decision margin...');
        try {
          const res = await analyzeNews(contentToAnalyze, mode, titleToAnalyze, analysisUrl);
          setResult(res);
          if (onAnalysisSaved) {
            onAnalysisSaved(res);
          }
          if (res.prediction === 'Likely Real News') {
            confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
          }
        } catch (err: any) {
          setErrorMessage(err.message || 'An error occurred during model inference.');
        } finally {
          setIsAnalyzing(false);
          setAnalysisStatus('');
        }
      }, 350);
    }, 350);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportText = `TRUTHSCAN - AI-POWERED FAKE NEWS VERIFICATION AUDIT REPORT
=============================================================
Analysis ID       : ${result.id}
Timestamp         : ${result.timestamp}
Input Mode        : ${result.inputMode.toUpperCase()}
Prediction Result : ${result.prediction.toUpperCase()}
Model Confidence  : ${result.confidenceScore}%
Algorithm         : ${result.modelAlgorithm}
Language          : ${result.diagnostics.detectedLanguage}

CONTENT EXCERPT:
-------------------------------------------------------------
${result.originalText}

LINGUISTIC DIAGNOSTICS:
-------------------------------------------------------------
Subjectivity Score   : ${result.diagnostics.subjectivityScore}%
Sensationalism Index : ${result.diagnostics.sensationalismIndex}%
Syntactic Complexity : ${result.diagnostics.syntacticComplexity}
Reading Level        : ${result.diagnostics.readingGradeLevel}
Emotional Tone       : ${result.diagnostics.emotionalTone}

TOP PREDICTIVE FEATURES (TF-IDF WEIGHTS):
-------------------------------------------------------------
${result.diagnostics.keyMarkers.map(m => `* [${m.type.toUpperCase()}] "${m.term}" (weight: ${m.weight > 0 ? '+' : ''}${m.weight.toFixed(2)}) - ${m.explanation}`).join('\n')}

MANDATORY FACT-CHECKING ADVICE:
-------------------------------------------------------------
${result.verificationAdvice.map((a, i) => `${i + 1}. ${a}`).join('\n')}

DISCLAIMER:
${result.limitationsNotice}
=============================================================
TruthScan B.Tech CSE Project`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `truthscan-report-${result.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Title & Introduction */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          News Verification Laboratory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Submit news content to assess authenticity through TF-IDF feature extraction and Passive Aggressive Classifier inference.
        </p>
      </div>

      {/* Preset Benchmarks Ribbon */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span>Sample Verification Benchmarks:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs font-medium px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs text-left cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Input Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Input Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => { setMode('headline'); setErrorMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'headline'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>1. News Headline</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('article'); setErrorMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'article'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Complete News Article</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('url'); setErrorMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'url'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. News Article URL</span>
          </button>
        </div>

        <form onSubmit={handleRunAnalysis} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'headline' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                News Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Breaking: Officials confirm new agricultural subsidies starting next fiscal quarter..."
                className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="block text-[11px] text-slate-500 mt-1">
                Enter single-sentence claims, viral social media post titles, or news ticker headlines.
              </span>
            </div>
          )}

          {mode === 'article' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Complete Article Body
              </label>
              <textarea
                rows={6}
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                placeholder="Paste the full multi-paragraph article body here..."
                className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                <span>Supports extensive multi-paragraph articles.</span>
                <span>{articleContent.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          )}

          {mode === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                News Article URL
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example-news-site.org/articles/story-2026"
                  className="w-full pl-9 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>
              <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                <p>• Only public HTTP/HTTPS URLs are accepted.</p>
                <p>• Private IP ranges, loopback localhost addresses, and cloud metadata ports are restricted for SSRF security.</p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setHeadline('');
                setArticleContent('');
                setUrlInput('');
                setResult(null);
                setErrorMessage(null);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Input</span>
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating NLP Pipeline...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Model Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Analysis Progress Bar */}
        {isAnalyzing && (
          <div className="bg-blue-50/80 px-6 py-3 border-t border-blue-100 flex items-center gap-3 text-xs text-blue-800">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
            <span className="font-medium">{analysisStatus}</span>
          </div>
        )}
      </div>

      {/* Model Analysis Results Card */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className={`p-6 sm:p-8 rounded-xl border shadow-xs ${
            result.prediction === 'Likely Real News'
              ? 'bg-emerald-50/40 border-emerald-200'
              : 'bg-red-50/40 border-red-200'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
              {/* Prediction Badge & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
                    result.prediction === 'Likely Real News'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {result.prediction === 'Likely Real News' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span>{result.prediction}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Mode: {result.inputMode.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {result.title}
                </h3>
              </div>

              {/* Confidence Score Meter */}
              <div className="flex flex-col items-start md:items-end shrink-0">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Model Confidence
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl sm:text-5xl font-extrabold tabular-nums font-mono ${
                    result.prediction === 'Likely Real News' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {result.confidenceScore.toFixed(1)}%
                  </span>
                </div>
                <div className="w-36 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.prediction === 'Likely Real News' ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${result.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Linguistic Diagnostics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Subjectivity Level</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums text-sm">
                  {result.diagnostics.subjectivityScore}%
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Sensationalism Index</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums text-sm">
                  {result.diagnostics.sensationalismIndex}%
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Syntactic Complexity</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {result.diagnostics.syntacticComplexity}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Reading Grade Level</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {result.diagnostics.readingGradeLevel}
                </span>
              </div>
            </div>

            {/* Explainable AI: Key Predictive Tokens */}
            <div className="pt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Model Explainability: Key Predictive Tokens & Weights
              </h4>
              <p className="text-xs text-slate-600">
                The TF-IDF Passive Aggressive vectorizer identified the following key unigrams/bigrams in this submission:
              </p>

              {result.diagnostics.keyMarkers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {result.diagnostics.keyMarkers.map((marker, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900">
                            "{marker.term}"
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            marker.type === 'credible' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {marker.type === 'credible' ? '+ Real Indicator' : '- Fake Indicator'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{marker.explanation}</p>
                      </div>
                      <span className="font-mono font-semibold text-slate-700 text-xs shrink-0">
                        {marker.weight > 0 ? '+' : ''}{marker.weight.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-500 italic">
                  No extreme polarity keywords detected; classification determined by distributed lexical densities and syntactic sentence structure.
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-mono">
                Algorithm: {result.modelAlgorithm}
              </span>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-800 font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Verification Report (.txt)</span>
              </button>
            </div>
          </div>

          {/* Important Limitations Notice & Verification Guidance */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Important Limitations & Responsible AI Notice
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {result.limitationsNotice}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <h5 className="text-xs font-semibold text-slate-800">
                Recommended Manual Cross-Verification Checklist:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                {result.verificationAdvice.map((advice, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{advice}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

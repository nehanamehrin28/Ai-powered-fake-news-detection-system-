import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  FolderTree, 
  BookOpen, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { PROJECT_CODE_FILES } from '../lib/projectCodebase';
import JSZip from 'jszip';

export const ProjectPackPage: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const activeFile = PROJECT_CODE_FILES[activeFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Project Root Files
      PROJECT_CODE_FILES.forEach(file => {
        zip.file(file.filename, file.code);
      });

      // Synthetic sample dataset
      const sampleCsv = `text,label
"Official spokesperson for the Ministry of Health announced updated guidelines today.",1
"Reuters confirmed that international central banks coordinated liquidity measures.",1
"According to the Associated Press, the emergency council convened on Tuesday.",1
"SHOCKING BOMBSHELL: Mainstream media refuses to reveal this secret miracle fruit banned from television!",0
"Urgent: Share before this gets deleted! Secret government conspiracy exposed by insiders!",0
"Miracle cure doctors don't want you to know: 100% proof this eliminates all pain!",0
`;
      zip.file("news_dataset.csv", sampleCsv);

      // Model folder placeholder
      zip.folder("models");
      zip.file("models/README.md", "# Pretrained models are saved here by running python train_model.py");

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "truthscan-btech-project-source.zip";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP creation failed:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const vivaQuestions = [
    {
      q: "Why was the Passive Aggressive Classifier chosen over Multinomial Naive Bayes or Logistic Regression?",
      a: "The Passive Aggressive Classifier (PAC) is an online, margin-based algorithm particularly suited for dynamic text and live news streams. Unlike Naive Bayes which assumes conditional independence among words (often violated in sensational phrasing), PAC adjusts its hyperplane aggressively whenever a classification error occurs or the margin (hinge loss) is violated, while remaining passive when verified claims meet the margin. This yields fast convergence on large sparse TF-IDF vectors without requiring complete retrains on streaming inputs."
    },
    {
      q: "How does TF-IDF vectorization capture deceptive news patterns?",
      a: "TF-IDF (Term Frequency-Inverse Document Frequency) measures how characteristic a word is to a specific document relative to the whole corpus. Clickbait headlines frequently use high-frequency emotional intensifiers ('shocking', 'bombshell', 'miracle cure') that appear with disproportionately high frequencies in fake stories, whereas credible news exhibits high TF-IDF weights for formal attribution verbs ('spokesperson', 'confirmed', 'according to', 'published')."
    },
    {
      q: "How is the confidence score calculated from a linear classifier?",
      a: "The Passive Aggressive Classifier outputs an uncalibrated decision function margin f(x) = w·x + b representing the geometric signed distance from the separating hyperplane. TruthScan calibrates this margin into a bounded probability score P(y=1|x) using Platt Sigmoid Scaling: σ(k · f(x)) = 1 / (1 + exp(-k · f(x))), ensuring the score reflects true empirical accuracy."
    },
    {
      q: "What security measures protect the news URL scraping endpoint against SSRF?",
      a: "The URL ingestion engine strictly restricts schemes to http/https, parses the destination hostname, and rejects all private, loopback, or link-local IP blocks (e.g., 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, 169.254.169.254 AWS/GCP metadata services). Furthermore, it disables browser execution scripts to prevent drive-by client exploit execution."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-4">
      {/* Header and Download CTA */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/80 border border-blue-800 px-3 py-1 rounded-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Submission & Placement Package</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            TruthScan: B.Tech Computer Science Project Kit
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Complete, self-contained project package with Flask backend, Scikit-learn TF-IDF & Passive Aggressive Classifier training scripts, SQLite schema, requirements, and viva voce guide.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Packaging Project ZIP...' : 'Download Full Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Architecture Diagram Spotlight */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">
            System Architecture & NLP Pipeline Schematic
          </h2>
          <p className="text-xs text-slate-500">
            End-to-end dataflow from text preprocessing to TF-IDF feature space and hyperplane margin separation.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
          <img
            src="/src/assets/images/nlp_model_architecture_1793894743398.jpg"
            alt="NLP Pipeline Diagram showing Tokenization, TF-IDF Vectorization, and Machine Learning Classification Hyperplane"
            className="w-full h-auto object-cover max-h-[500px]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Interactive Code Viewer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Interactive Source Code Repository
            </h3>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Current File</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          {/* File Explorer Sidebar */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/70 p-3 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
              Project Files
            </span>
            {PROJECT_CODE_FILES.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setActiveFileIndex(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                  activeFileIndex === idx
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-4 h-4 shrink-0 opacity-80" />
                  <span className="truncate">{file.filename}</span>
                </div>
                <span className={`text-[10px] uppercase font-sans font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  activeFileIndex === idx ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {file.category}
                </span>
              </button>
            ))}
          </div>

          {/* Code Body Area */}
          <div className="md:col-span-8 bg-slate-950 p-4 sm:p-6 overflow-x-auto text-white">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span>{activeFile.filename}</span>
              <span className="text-[11px] text-slate-500">{activeFile.description}</span>
            </div>
            <pre className="font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto selection:bg-blue-600 selection:text-white">
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Viva-Voce Examination Preparation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Viva-Voce & Technical Defense Q&A Preparation
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Core theoretical and architectural questions commonly posed by university project examiners:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vivaQuestions.map((viva, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-900 block leading-snug">
                Q{idx + 1}: {viva.q}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {viva.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

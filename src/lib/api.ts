import { AnalysisResult, AnalysisStats, InputMode, User } from '../types';
import { analyzeNewsContent } from './mlEngine';

const STORAGE_KEY_HISTORY = 'truthscan_history_v2';
const STORAGE_KEY_USER = 'truthscan_active_user';

// Local storage fallback helpers
function getLocalHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Local history read error:', e);
  }
  return [];
}

function saveLocalHistory(items: AnalysisResult[]) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(items));
  } catch (e) {
    console.error('Local history write error:', e);
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Local user read error:', e);
  }
  return {
    id: 'usr-student-default',
    name: 'Neha Mehrin',
    email: 'nehanamehrin28@gmail.com',
    role: 'user',
    institution: 'B.Tech CSE Final Year',
    createdAt: new Date().toISOString()
  };
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

/**
 * Execute news analysis with server-side API or client ML fallback
 */
export async function analyzeNews(
  content: string,
  type: InputMode,
  title?: string,
  url?: string
): Promise<AnalysisResult> {
  const user = getCurrentUser();
  const userId = user?.id;

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type, title, url, userId })
    });

    if (response.ok) {
      const data = await response.json();
      // Sync local storage as well
      const local = getLocalHistory();
      saveLocalHistory([data, ...local.filter(x => x.id !== data.id)].slice(0, 100));
      return data;
    }
  } catch (err) {
    console.warn('Backend API request failed, utilizing client-side NLP ML engine:', err);
  }

  // Client-side fallback engine
  const localResult = analyzeNewsContent(content, type, title, url);
  if (userId) localResult.userId = userId;
  const local = getLocalHistory();
  saveLocalHistory([localResult, ...local].slice(0, 100));
  return localResult;
}

/**
 * Extract article text from URL safely
 */
export async function extractUrlContent(url: string): Promise<{ title: string; text: string }> {
  try {
    const response = await fetch('/api/extract-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (response.ok) {
      return await response.json();
    }
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error ${response.status}`);
  } catch (err: any) {
    throw new Error(err.message || 'Failed to extract content from URL');
  }
}

/**
 * Get analysis history
 */
export async function getHistory(userId?: string): Promise<AnalysisResult[]> {
  try {
    const url = userId ? `/api/history?userId=${encodeURIComponent(userId)}` : '/api/history';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('API fetch history failed, using local storage:', err);
  }
  return getLocalHistory();
}

/**
 * Delete single record
 */
export async function deleteHistoryRecord(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const local = getLocalHistory().filter(x => x.id !== id);
      saveLocalHistory(local);
      return true;
    }
  } catch (e) {
    console.warn('Delete via API failed, updating local storage:', e);
  }
  const local = getLocalHistory().filter(x => x.id !== id);
  saveLocalHistory(local);
  return true;
}

/**
 * Clear all history
 */
export async function clearAllHistory(userId?: string): Promise<boolean> {
  try {
    const url = userId ? `/api/history?userId=${encodeURIComponent(userId)}` : '/api/history';
    await fetch(url, { method: 'DELETE' });
  } catch (e) {
    console.warn('Clear via API failed:', e);
  }
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  return true;
}

/**
 * Get statistical metrics
 */
export async function getAnalysisStats(userId?: string): Promise<AnalysisStats> {
  try {
    const url = userId ? `/api/stats?userId=${encodeURIComponent(userId)}` : '/api/stats';
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Stats API failed, computing from local history:', err);
  }

  const items = getLocalHistory();
  const totalAnalyzed = items.length;
  const realCount = items.filter(r => r.prediction === 'Likely Real News').length;
  const fakeCount = items.filter(r => r.prediction === 'Potentially Fake News').length;
  const averageConfidence = totalAnalyzed > 0 
    ? Math.round(items.reduce((acc, r) => acc + r.confidenceScore, 0) / totalAnalyzed * 10) / 10 
    : 0;

  const now = new Date();
  const todayCount = items.filter(r => new Date(r.timestamp).toDateString() === now.toDateString()).length;
  const headlineCount = items.filter(r => r.inputMode === 'headline').length;
  const articleCount = items.filter(r => r.inputMode === 'article').length;
  const urlCount = items.filter(r => r.inputMode === 'url').length;

  return {
    totalAnalyzed,
    realCount,
    fakeCount,
    averageConfidence,
    todayCount,
    headlineCount,
    articleCount,
    urlCount
  };
}

// Helper: returns local date as YYYY-MM-DD (ISO-style but local timezone)
function getLocalIsoDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function logPageReadToday(bookId, pageIdx) {
  try {
    const today = getLocalIsoDate();
    const STORAGE_KEY = 'wisdom_pages_read_today';
    const raw = localStorage.getItem(STORAGE_KEY);
    let data = { date: today, reads: {} };
    
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today && parsed.reads) {
          data = parsed;
        }
      } catch (e) {
        // ignore and overwrite
      }
    }
    
    const bIdStr = String(bookId);
    if (!data.reads[bIdStr]) {
      data.reads[bIdStr] = [];
    }
    if (!data.reads[bIdStr].includes(pageIdx)) {
      data.reads[bIdStr].push(pageIdx);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error logging page read:', e);
  }
}

export function checkChallengeCompletionToday(challengeId) {
  const progress = getChallengeTodayProgress(challengeId);
  return progress.current >= progress.target;
}

export function getChallengeTodayProgress(challengeId) {
  const today = getLocalIsoDate();
  
  if (challengeId === 'lotus_jar_5') {
    const storedDate = localStorage.getItem('wisdom_jar_date');
    const count = storedDate === today ? parseInt(localStorage.getItem('wisdom_jar_count') || '0', 10) : 0;
    return { current: count, target: 5, unit: 'quotes' };
  }
  
  // For book-based challenges
  const raw = localStorage.getItem('wisdom_pages_read_today');
  let reads = {};
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today && parsed.reads) {
        reads = parsed.reads;
      }
    } catch (e) {
      // ignore
    }
  }
  
  if (challengeId === 'bhagavad_gita_3') {
    // Bhagavad Gita books are Book IDs 1 & 3
    const pages1 = reads['1'] || [];
    const pages3 = reads['3'] || [];
    const uniquePages = new Set([...pages1, ...pages3]);
    return { current: uniquePages.size, target: 3, unit: 'pages' };
  }
  
  if (challengeId === 'anxiety_guide') {
    // Anxiety books are Book IDs 3 & 6
    const pages3 = reads['3'] || [];
    const pages6 = reads['6'] || [];
    const uniquePages = new Set([...pages3, ...pages6]);
    return { current: uniquePages.size, target: 1, unit: 'page' };
  }
  
  if (challengeId === 'discipline_week') {
    // Chanakya Neeti books are Book IDs 2 & 4
    const pages2 = reads['2'] || [];
    const pages4 = reads['4'] || [];
    const uniquePages = new Set([...pages2, ...pages4]);
    return { current: uniquePages.size, target: 2, unit: 'pages' };
  }
  
  return { current: 0, target: 1, unit: 'action' };
}

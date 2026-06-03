/**
 * Escapes characters that could be used for Cross-Site Scripting (XSS).
 * Maps special HTML characters to their safe entity representation.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'/]/g, (match) => {
    switch (match) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#x27;';
      case '/': return '&#x2F;';
      default: return match;
    }
  });
}

/**
 * Validates and converts input values to primitive string types.
 * Prevents object injection (e.g. passing { $gt: "" } to bypass auth or query constraints).
 * @param {any} val 
 * @param {string} defaultVal 
 * @returns {string}
 */
export function ensureString(val, defaultVal = '') {
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return defaultVal;
}

/**
 * Removes MongoDB/NoSQL operators (keys starting with $) recursively
 * to prevent NoSQL query injection.
 * @param {any} obj 
 * @returns {any}
 */
export function sanitizeNoSql(obj) {
  if (obj instanceof Array) {
    return obj.map(item => sanitizeNoSql(item));
  } else if (obj !== null && typeof obj === 'object') {
    const cleanObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.startsWith('$')) {
          continue; // Strip out key
        }
        cleanObj[key] = sanitizeNoSql(obj[key]);
      }
    }
    return cleanObj;
  }
  return obj;
}

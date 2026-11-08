/**
 * Cross-browser safe date formatting.
 * Safely handles null, undefined, timestamps, ISO strings, space-delimited dates.
 * Prevents WebKit / Safari RangeError and Invalid Date crashes.
 */

function parseSafeDate(val) {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  // If string has spaces e.g. "2026-11-08 22:40:00", Safari prefers ISO "T"
  let strVal = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(strVal)) {
    strVal = strVal.replace(' ', 'T');
  }

  const d = new Date(strVal);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(val, fallback = '-') {
  const d = parseSafeDate(val);
  if (!d) return fallback;

  try {
    return d.toLocaleDateString('ar-DZ');
  } catch {
    try {
      return d.toLocaleDateString('ar');
    } catch {
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    }
  }
}

export function formatDateTime(val, fallback = '-') {
  const d = parseSafeDate(val);
  if (!d) return fallback;

  try {
    return d.toLocaleString('ar-DZ');
  } catch {
    try {
      return d.toLocaleString('ar');
    } catch {
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
  }
}

/**
 * Dynamically updates the canonical link, title, meta description, and Open Graph tags
 * for client-side routing in the Fitna React SPA.
 */
export const updatePageSeo = ({ canonicalPath = '', title = '', description = '' }) => {
  if (typeof document === 'undefined') return;

  const baseUrl = 'https://minasat-fitna.vercel.app';
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : (canonicalPath ? `/${canonicalPath}` : '');
  const canonicalUrl = `${baseUrl}${cleanPath}`;

  // 1. Canonical Link
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.setAttribute('href', canonicalUrl);

  // 2. Open Graph URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', canonicalUrl);
  }

  // 3. Document Title & OG Title
  if (title) {
    document.title = title;
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
  }

  // 4. Meta Description & OG Description
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);
  }
};

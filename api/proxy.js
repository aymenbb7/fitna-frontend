import https from 'node:https';

export const config = {
  api: {
    bodyParser: false, // Stream request bodies directly (vital for multipart/form-data & JSON)
  },
};

export default function handler(req, res) {
  const backendHost = 'fitna-backend-production.up.railway.app';

  // Extract path from query parameter 'path' or fallback to req.url
  let targetPath = '';
  const urlObj = new URL(req.url, 'http://localhost');
  const pathParam = urlObj.searchParams.get('path');

  if (pathParam !== null && pathParam !== undefined) {
    let clean = pathParam.startsWith('/') ? pathParam.slice(1) : pathParam;
    if (clean.startsWith('api/v1/')) {
      targetPath = '/' + clean;
    } else if (clean.startsWith('media/')) {
      targetPath = '/' + clean;
    } else {
      targetPath = '/api/v1/' + clean;
    }

    // Re-attach any remaining query parameters
    urlObj.searchParams.delete('path');
    const remaining = urlObj.searchParams.toString();
    if (remaining) {
      targetPath += (targetPath.includes('?') ? '&' : '?') + remaining;
    }
  } else {
    targetPath = req.url;
  }

  const headers = { ...req.headers };
  // Set Host header for Railway's routing & SSL SNI
  headers['host'] = backendHost;
  // Tell Django the original client origin so CORS / CSRF match
  headers['x-forwarded-host'] = req.headers['host'] || 'minasat-fitna.vercel.app';
  headers['x-forwarded-proto'] = 'https';
  delete headers['connection'];

  const proxyOptions = {
    hostname: backendHost,
    port: 443,
    path: targetPath,
    method: req.method,
    headers: headers,
    timeout: 45000,
  };

  const proxyReq = https.request(proxyOptions, (proxyRes) => {
    res.statusCode = proxyRes.statusCode;

    for (const [key, value] of Object.entries(proxyRes.headers)) {
      res.setHeader(key, value);
    }

    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Vercel API Proxy Error:', err.message);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'تعذر الاتصال بخادم المنصة. يرجى المحاولة لاحقاً.',
        detail: err.message,
      }));
    }
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.statusCode = 504;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'انتهت مهلة الاتصال بالخادم. يرجى المحاولة لاحقاً.',
      }));
    }
  });

  // Stream client request body (works seamlessly for GET, POST, PATCH, PUT, DELETE, file uploads)
  req.pipe(proxyReq);
}

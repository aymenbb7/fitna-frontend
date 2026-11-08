import https from 'node:https';

export const config = {
  api: {
    bodyParser: false, // Stream request bodies directly (vital for multipart/form-data & JSON)
  },
};

export default function handler(req, res) {
  const backendHost = 'fitna-backend-production.up.railway.app';

  // Extract path from req.url
  // req.url in Vercel for api/v1/[...path] will be e.g. /api/v1/modules/ or /api/v1/auth/login/
  let targetPath = req.url;
  if (!targetPath.startsWith('/api/v1')) {
    targetPath = '/api/v1' + (targetPath.startsWith('/') ? targetPath : '/' + targetPath);
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

  // Stream client request body
  req.pipe(proxyReq);
}

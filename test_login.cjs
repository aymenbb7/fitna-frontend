const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Intercept and log network requests to the backend
  page.on('request', request => {
    if (request.url().includes('/api/v1/auth/login/')) {
      console.log('--- REQUEST ---');
      console.log('URL:', request.url());
      console.log('Method:', request.method());
      console.log('Headers:', request.headers());
      console.log('Post Data:', request.postData());
    }
  });

  page.on('response', async response => {
    if (response.url().includes('/api/v1/auth/login/')) {
      console.log('--- RESPONSE ---');
      console.log('Status:', response.status());
      try {
        const body = await response.json();
        console.log('Body:', body);
      } catch (e) {
        console.log('Body: could not parse json');
      }
    }
  });

  page.on('console', msg => {
    console.log(`[CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  console.log('Navigating to Vercel production...');
  await page.goto('https://fitna-frontend.vercel.app/login');
  
  // Fill the form
  console.log('Filling form...');
  await page.fill('input[type="text"]', 'superadmin@fitna.dz');
  await page.fill('input[type="password"]', 'Admin1234');
  
  // Click login
  console.log('Clicking login...');
  await page.click('button[type="submit"]');

  // Wait a bit to let network requests finish
  await page.waitForTimeout(3000);
  
  console.log('Current URL after login:', page.url());
  
  await browser.close();
})();

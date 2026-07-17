const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console logs
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  // Navigate to login
  await page.goto('http://localhost:5173/login');
  
  // Fill the form
  await page.fill('input[type="text"]', 'superadmin');
  await page.fill('input[type="password"]', 'Aymen123');
  
  // Click login
  await page.click('button[type="submit"]');

  // Wait for network idle or navigation
  await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});
  
  // Wait a moment for rendering and console logs
  await page.waitForTimeout(2000);
  
  console.log('Current URL after login:', page.url());
  
  await browser.close();
})();

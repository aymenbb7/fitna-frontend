const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.route('**/auth/me/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, full_name: 'Module Admin', role: 'MODULE_ADMIN', email: 'mod@fitna.com' })
    });
  });
  
  await page.route('**/admin/stats/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ total_students: 10, active_students: 5, total_modules: 3 })
    });
  });
  
  await page.route('**/admin/modules/dashboard-stats/', route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
  
  await page.route('**/auth/notifications/', route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await page.goto('http://localhost:5173/');
  await page.evaluate(() => { localStorage.setItem('accessToken', 'mock-token'); });
  await page.goto('http://localhost:5173/dashboard/admin', { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: 'screenshot2.png', fullPage: true });
  
  console.log('Screenshot 2 taken.');
  await browser.close();
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (response.status() >= 400 && response.url().includes('api')) {
      console.log('API FAILED:', response.url(), response.status());
    }
  });

  // Mock API requests for auth and stats
  await page.route('**/auth/me/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        full_name: 'Admin',
        role: 'SUPER_ADMIN',
        email: 'admin@fitna.com'
      })
    });
  });
  
  await page.route('**/admin/stats/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        total_students: 10,
        active_students: 5,
        total_module_admins: 2,
        total_modules: 3
      })
    });
  });
  
  await page.route('**/admin/modules/dashboard-stats/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });
  
  await page.route('**/auth/notifications/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  console.log('Navigating to http://localhost:5173/dashboard/admin ...');
  
  // Set localStorage token before navigating
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('accessToken', 'mock-token');
  });
  
  await page.goto('http://localhost:5173/dashboard/admin', { waitUntil: 'networkidle' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Done.');
  await browser.close();
})();

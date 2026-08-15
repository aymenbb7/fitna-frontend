const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.route('**/auth/me/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        full_name: 'Test Super Admin',
        role: 'SUPER_ADMIN',
        email: 'admin@test.com'
      })
    });
  });

  await page.route('**/admin/stats/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        total_students: 100,
        total_modules: 5,
        total_module_admins: 2,
        active_users_today: 10
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

  await page.goto('http://localhost:4173/dashboard/admin');

  await page.evaluate(() => {
    localStorage.setItem('accessToken', 'mock_token');
    localStorage.setItem('refreshToken', 'mock_token');
  });

  await page.goto('http://localhost:4173/dashboard/admin');
  await page.waitForTimeout(3000);

  const html = await page.content();
  console.log('ROOT CONTENT LENGTH:', html.length);
  const rootContent = await page.evaluate(() => document.getElementById('root').innerHTML.length);
  console.log('ROOT INNER HTML LENGTH:', rootContent);

  await browser.close();
})();

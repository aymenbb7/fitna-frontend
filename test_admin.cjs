const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  async function testLogin(email, password, pages) {
    console.log(`\n============================`);
    console.log(`Testing Login: ${email}`);
    console.log(`============================`);
    const page = await browser.newPage();
    
    page.on('response', async response => {
      if (response.url().includes('/api/v1/') && response.status() >= 400) {
        console.log(`\n[FAILED REQUEST]`);
        console.log(`URL: ${response.url()}`);
        console.log(`Status: ${response.status()}`);
        try {
          const body = await response.json();
          console.log(`Response Body:`, JSON.stringify(body));
        } catch (e) {
          console.log(`Response Body: <Could not parse JSON>`);
        }
      }
    });

    await page.goto('https://minasat-fitna.vercel.app/login');
    await page.fill('input[type="text"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(2000);

    for (const p of pages) {
      console.log(`\nNavigating to: ${p}`);
      await page.goto(`https://minasat-fitna.vercel.app${p}`);
      await page.waitForTimeout(3000); // Give time for API calls to fire
    }
    
    await page.close();
  }

  await testLogin('superadmin@fitna.dz', 'Admin1234', [
    '/dashboard/admin'
  ]);

  await testLogin('admin_quran@fitna.dz', 'Admin1234', [
    '/dashboard/admin',
    '/dashboard/admin/students',
    '/dashboard/admin/my-modules'
  ]);

  await browser.close();
})();

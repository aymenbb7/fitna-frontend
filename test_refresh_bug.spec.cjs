const { test, expect } = require('@playwright/test');

test('test refresh bug', async ({ page }) => {
  // 1. Go to login page
  await page.goto('http://localhost:5173/login');
  
  // 2. Fill login details (student)
  await page.fill('input[placeholder="username / email"]', 'admin_soroban@fitna.dz');
  await page.fill('input[placeholder="••••••••"]', 'Aymen123');
  await page.click('button[type="submit"]');

  // 3. Wait for dashboard
  await page.waitForURL('**/dashboard/admin');
  console.log("Logged in and reached admin dashboard.");

  await page.goto('http://localhost:5173/dashboard/admin/my-modules');
  await page.waitForURL('**/dashboard/admin/my-modules');
  console.log("Reached admin modules page.");

  // 4. Reload page
  await page.reload();
  
  // 5. Check if we stay on dashboard or redirect
  await page.waitForTimeout(3000); // wait for load
  
  const currentUrl = page.url();
  console.log("URL after reload:", currentUrl);
  
  if (currentUrl.includes('/dashboard/admin/my-modules')) {
    console.log("SUCCESS: Refresh bug is not happening on admin modules.");
  } else {
    console.error("FAIL: Redirected to", currentUrl);
  }
});

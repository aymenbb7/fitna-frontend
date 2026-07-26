const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Login
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'super@fitna.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button:has-text("تسجيل الدخول")');
  await page.waitForURL('**/dashboard/admin');

  // Go to psychology module content
  await page.goto('http://localhost:5173/dashboard/admin/modules/psychology/content');
  await page.waitForSelector('text=اختبارات');
  
  // Intercept requests
  page.on('response', response => {
    if (response.url().includes('quizzes') && response.request().method() === 'POST') {
      console.log('POST', response.url(), response.status());
      response.text().then(text => console.log('Response:', text)).catch(() => {});
    }
  });

  // Open quizzes
  await page.click('button:has-text("اختبارات")');
  await page.waitForTimeout(1000);
  
  // Click create quiz if no quizzes, else click 'الأسئلة' on first quiz
  const createBtn = await page.$('button:has-text("إنشاء اختبار")');
  if (createBtn) {
    await createBtn.click();
    await page.fill('input[placeholder="مثال: اختبار الوحدة الأولى"]', 'Test Quiz');
    await page.click('button:has-text("إنشاء الاختبار")');
    await page.waitForTimeout(1000);
  }

  // Click الأسئلة
  const questionsBtn = await page.waitForSelector('button:has-text("الأسئلة")');
  await questionsBtn.click();
  
  // Click إضافة سؤال
  await page.click('button:has-text("إضافة سؤال")');
  
  // Fill question
  await page.fill('textarea[placeholder="أدخل نص السؤال..."]', 'What is 2+2?');
  
  // Fill choices
  const inputs = await page.$$('input[placeholder^="الخيار"]');
  await inputs[0].fill('4');
  await inputs[1].fill('3');
  await inputs[2].fill('5');
  await inputs[3].fill('1');
  
  // Set correct (click first option)
  const choices = await page.$$('div.cursor-pointer');
  await choices[0].click();
  
  // Submit
  await page.click('button:has-text("إضافة السؤال")');
  await page.waitForTimeout(2000);
  
  await browser.close();
})();

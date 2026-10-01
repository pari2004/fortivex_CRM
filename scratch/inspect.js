const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  await new Promise(r => setTimeout(r, 2000));
  
  const ls = await page.evaluate(() => {
    return {
      crm_user_permissions: localStorage.getItem('crm_user_permissions'),
      crm_roles: localStorage.getItem('crm_roles'),
      crm_custom_roles: localStorage.getItem('crm_custom_roles'),
      empowers_session: localStorage.getItem('empowers_session')
    };
  });
  
  console.log(JSON.stringify(ls, null, 2));
  await browser.close();
})();

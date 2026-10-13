import {test, expect} from '@playwright/test';

test('التنقل الرئيسي يعرض المحتوى المتاح والمؤجل دون أخطاء',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1366,height:768});await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 for(const [label,heading,soon] of [
  ['أهداف البيئة','أهداف البيئة التدريبية',false],['لوحة الإعلانات','لوحة الإعلانات',false],
  ['الاختبار القبلي','الاختبار القبلي',false],['الموديولات التعليمية','الموديولات التعليمية',false],
  ['النشاط التعليمي','النشاط التعليمي',false],['الاختبار البعدي','الاختبار البعدي',true],
  ['التواصل','التواصل',true],['دليل الاستخدام','دليل الاستخدام',true],['الرئيسية','اختلاف نمط التحدي',false],
 ]){
  await page.getByRole('navigation').getByRole('link',{name:label,exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toContainText(heading);
  const selected=page.getByRole('navigation').getByRole('link',{name:label,exact:true});
  await expect(selected).toHaveAttribute('aria-current','page');
  await expect(selected).toHaveCSS('color','rgb(181, 31, 60)');
  await expect(selected).toHaveCSS('background-color','rgb(232, 242, 251)');
  await expect(page.locator('.top-nav a.active')).toHaveCount(1);
  if(soon) await expect(page.locator('.coming-label')).toHaveText('Coming Soon');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 expect(errors).toEqual([]);
});

test('رحلة الموديول والدرس تعرض الأقسام الخمسة مع السابق والتالي وإعادة التحميل',async({page})=>{
 await page.goto('/#modules');await page.locator('.module-card').first().click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('مقدمة الموديول');
 await page.getByRole('link',{name:'أهداف الموديول',exact:true}).last().click();
 await expect(page.locator('.content-list li')).toHaveCount(17);
 await page.getByRole('link',{name:'محتوى الموديول',exact:true}).last().click();
 await expect(page.locator('.lesson-card')).toHaveCount(3);await page.locator('.lesson-card').first().click();
 await expect(page.locator('.content-list li')).toHaveCount(5);
 await page.getByRole('link',{name:'ابدأ محتوى الدرس'}).click();
 const headings=['تعريف دمج التكنولوجيا في التعليم','أهمية دمج التكنولوجيا في التعليم','أهداف دمج التكنولوجيا في التعليم','متطلبات دمج التكنولوجيا في التعليم','مقومات نجاح دمج التكنولوجيا في التعليم'];
 for(let i=0;i<5;i++){
  await expect(page.getByRole('heading',{level:1})).toHaveText(headings[i]);
  if(i===0)await expect(page.locator('.definition-text article')).toHaveCount(2);
  if(i===3) {await page.reload();await expect(page.locator('.content-list li')).toHaveCount(4);}
  if(i<4)await page.getByRole('link',{name:'التالي',exact:true}).click();
 }
 await expect(page.locator('.content-list li')).toHaveCount(7);
 await page.getByRole('link',{name:'السابق',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText(headings[3]);
 await page.getByRole('link',{name:'محتوى الموديول',exact:true}).click();
 await page.locator('.lesson-card').nth(1).click();await expect(page.locator('.coming-label')).toHaveText('Coming Soon');
});

test('الشاشات القصيرة على اللابتوب لا تتطلب تمريرًا والمحتوى الطويل متاح كاملًا',async({page})=>{
 for(const size of [{width:1366,height:768},{width:1280,height:640},{width:1536,height:700}]){
  await page.setViewportSize(size);
  for(const route of ['home','environment-goals','announcements','modules','module/1/introduction','module/1/lessons','lesson/1/goals']){
   await page.goto(`/#${route}`);await expect(page.getByRole('heading',{level:1})).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight),`${route} at ${size.width}x${size.height}`).toBe(true);
  }
 }
 await page.setViewportSize({width:1366,height:768});
 await expect(page.getByRole('img',{name:'شعار كلية التربية النوعية',exact:true})).toBeVisible();
 await page.goto('/#module/1/goals');await expect(page.locator('.content-list li').last()).toContainText('مرحلة التقويم');
 await page.locator('.content-list li').last().scrollIntoViewIfNeeded();await expect(page.locator('.content-list li').last()).toBeInViewport();
 await page.goto('/#home');await page.screenshot({path:'test-results/ui-home.png',fullPage:true});
 await page.goto('/#lesson/1/definition');await page.screenshot({path:'test-results/ui-lesson.png',fullPage:true});
});

test('عرض الهاتف وصورة التقسيمة والتنقل بلوحة المفاتيح',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const route of ['home','modules','module/1/lessons','lesson/1/definition','lesson/1/foundations']){
  await page.goto(`/#${route}`);await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
  expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
 }
 await page.goto('/#modules');await page.getByRole('button',{name:'عرض تقسيمة الموديولات الأربعة'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.screenshot({path:'test-results/ui-mobile.png',fullPage:true});
});

import {test,expect} from '@playwright/test';

test('الاختبار العام يعرض وصف 80 سؤالًا والأسئلة الخمسة المتاحة فقط دون تفعيل الحل',async({page})=>{
 await page.setViewportSize({width:1280,height:640});await page.goto('/#pre-test');
 await expect(page.getByRole('heading',{level:1})).toHaveText('الاختبار القبلي العام');
 await expect(page.locator('.assessment-stats strong')).toHaveText(['80','54','26']);
 await expect(page.locator('.assessment-availability')).toContainText('5 أسئلة');
 expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);
 await page.locator('.assessment-tabs').getByRole('link',{name:'التعليمات',exact:true}).click();
 await expect(page.locator('.assessment-instructions li')).toHaveCount(5);
 await page.locator('.assessment-tabs').getByRole('link',{name:'الأسئلة المتاحة',exact:true}).click();
 await expect(page.locator('.question-preview h2')).toHaveCount(1);
 await expect(page.locator('.question-section-heading h2')).toContainText('السؤال الأول: اختر');
 await expect(page.locator('.question-local-number')).toHaveText('1. ');
 await expect(page.locator('.question-section-tabs button')).toHaveCount(2);
 await expect(page.locator('.question-preview h2')).toContainText('جميع ما يأتي عدا');
 await expect(page.locator('.question-options li')).toHaveCount(4);
 await expect(page.getByRole('button',{name:'Previous'})).toBeDisabled();
 for(let i=0;i<4;i++)await page.getByRole('button',{name:'Next',exact:true}).click();
 await expect(page.locator('.question-preview h2')).toContainText('التقليدي فقط');
 await expect(page.locator('.question-section-heading h2')).toContainText('السؤال الثاني: ضع علامة صح أو خطأ');
 await expect(page.locator('.question-meta')).toContainText('السؤال الأول');
 await expect(page.locator('.question-local-number')).toHaveText('1. ');
 await expect(page.locator('.question-options li')).toHaveCount(2);
 await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Previous'}).click();
 await expect(page.locator('.question-preview h2')).toContainText('متطلبات');
 await expect(page.locator('.question-local-number')).toHaveText('4. ');
 await page.getByRole('button',{name:'السؤال الثاني: صح وخطأ',exact:false}).click();
 await expect(page.locator('.question-local-number')).toHaveText('1. ');
 await page.getByRole('button',{name:'السؤال الأول: اختر',exact:false}).click();
 await expect(page.locator('.question-preview h2')).toContainText('جميع ما يأتي عدا');
 await expect(page.locator('input,textarea')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Submit'})).toHaveCount(0);
 await expect(page.locator('.top-nav a[aria-current="page"]')).toHaveText('الاختبار القبلي');
 await page.goto('/#pre-test');await page.screenshot({path:'test-results/general-pre-overview.png',fullPage:true});
});

test('تقويم الدرس القبلي والبعدي يعرضان وصف 9 أسئلة ويعيدان الأسئلة الثلاثة نفسها',async({page})=>{
 await page.setViewportSize({width:1366,height:768});
 await page.goto('/#lesson/1/goals');
 await expect(page.locator('.section-nav').getByRole('link',{name:'الاختبار القبلي للدرس الأول',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'عرض الاختبار القبلي للدرس الأول',exact:false}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('الاختبار القبلي للدرس الأول');
 await expect(page.locator('.section-nav .lesson-pretest-link')).toHaveClass(/selected/);
 const captured=[];
 for(const phase of ['pre-test','post-test']){
  await page.goto(`/#lesson/1/${phase}`);
  await expect(page.locator('.assessment-stats strong')).toHaveText(['9','5','4']);
  await expect(page.locator('.assessment-availability')).toContainText('3 أسئلة');
  if(phase==='post-test')await expect(page.locator('.assessment-purpose')).toContainText('هو نفسه الاختبار القبلي');
  await page.locator('.assessment-tabs').getByRole('link',{name:'الأسئلة المتاحة',exact:true}).click();
  const questions=[];
  for(let i=0;i<3;i++){
   await expect(page.locator('.question-options li')).toHaveCount(4);
   questions.push({prompt:await page.locator('.question-preview h2').textContent(),choices:await page.locator('.question-options p').allTextContents()});
   if(i<2)await page.getByRole('button',{name:'Next',exact:true}).click();
  }
  captured.push(questions);
  await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
  await expect(page.locator('input')).toHaveCount(0);
 }
 expect(captured[1]).toEqual(captured[0]);
 await page.goto('/#lesson/1/pre-test');await page.screenshot({path:'test-results/lesson-pre-overview.png',fullPage:true});
});

test('الأنشطة تعرض تفاصيلها وأسئلتها الواردة مع بقاء التنفيذ مؤجلًا وعرض الهاتف سليم',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#activities');
 await expect(page.locator('.activity-cards a')).toHaveCount(2);
 await page.locator('.activity-cards a').first().click();
 await expect(page.locator('.activity-detail')).toContainText('30 ثانية');
 await page.locator('.assessment-tabs').getByRole('button',{name:'الأسئلة المتاحة',exact:true}).click();
 await expect(page.locator('.question-preview h2')).toContainText('ما المقصود');
 await expect(page.locator('input')).toHaveCount(0);
 for(const route of ['pre-test/questions','lesson/1/pre-test/questions','lesson/1/post-test','activities/technology-puzzles']){
  await page.goto('/#'+route);await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
 }
 await page.locator('.assessment-tabs').getByRole('button',{name:'الأسئلة المتاحة',exact:true}).click();
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'Next',exact:true}).click();
 await expect(page.locator('.question-meta')).toContainText('المستوى 3');
 await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
});

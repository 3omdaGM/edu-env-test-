import React, {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight, Clock3} from 'lucide-react';

const tabs = [['overview','وصف الاختبار'],['instructions','التعليمات'],['questions','الأسئلة المتاحة']];
const optionLetters = ['أ','ب','ج','د'];

export default function AssessmentPage({assessment,baseRoute,tab='overview'}) {
 const [index,setIndex]=useState(0);
 useEffect(()=>setIndex(0),[assessment.id]);
 const selectedTab=tabs.some(([id])=>id===tab)?tab:'overview';
 const question=assessment.questions[index];
 const available=assessment.questions.length;
 return <article className="assessment-page">
  <div className="page-heading">
   <span className="eyebrow">{assessment.scope}</span>
   <h1 tabIndex="-1">{assessment.title}</h1>
  </div>
  <nav className="assessment-tabs" aria-label="تفاصيل الاختبار">
   {tabs.map(([id,label])=><a key={id} href={`#${baseRoute}/${id}`} className={id===selectedTab?'selected':''} aria-current={id===selectedTab?'page':undefined}>{label}</a>)}
  </nav>
  {selectedTab==='overview'&&<>
   <p className="assessment-purpose">{assessment.purpose}</p>
   <div className="assessment-stats">
    {[['عدد الأسئلة',assessment.total],['اختيار من متعدد',assessment.multipleChoice],['صح وخطأ',assessment.trueFalse]].map(([label,count])=><div key={label}><strong>{count}</strong><span>{label}</span></div>)}
   </div>
   <p className="assessment-availability">المتاح حاليًا: <strong>{available} أسئلة</strong> من أصل {assessment.total}. باقي الأسئلة <span lang="en" dir="ltr">Coming Soon</span>.</p>
   <a className="button secondary" href={`#${baseRoute}/instructions`}>تعليمات الاختبار <ArrowLeft size={16}/></a>
  </>}
  {selectedTab==='instructions'&&<>
   <ol className="assessment-instructions">{assessment.instructions.map(item=><li key={item}>{item}</li>)}</ol>
   <div className="assessment-preview-note"><Clock3 size={16}/><span>عرض الأسئلة فقط؛ الإجابة والتصحيح في المرحلة التالية.</span></div>
   <a className="button secondary" href={`#${baseRoute}/questions`}>عرض الأسئلة المتاحة <ArrowLeft size={16}/></a>
  </>}
  {selectedTab==='questions'&&<>
   <div className="question-preview" aria-live="polite">
    <div className="question-meta"><span>السؤال {index+1} من {available} أسئلة متاحة</span><span>{question.type==='choice'?'اختيار من متعدد':'صح وخطأ'}</span></div>
    <h2>{question.prompt}</h2>
    <ol className="question-options">{question.options.map((option,i)=><li key={option}><span aria-hidden="true">{question.type==='choice'?optionLetters[i]:i===0?'✓':'×'}</span><p>{option}</p></li>)}</ol>
   </div>
   <div className="question-preview-controls"><button type="button" className="button secondary" disabled={index===0} onClick={()=>setIndex(i=>i-1)}><ArrowRight size={16}/><span lang="en">Previous</span></button><span dir="ltr">{index+1} / {available}</span><button type="button" className="button secondary" disabled={index===available-1} onClick={()=>setIndex(i=>i+1)}><span lang="en">Next</span><ArrowLeft size={16}/></button></div>
   <div className="assessment-preview-note"><Clock3 size={16}/><span>عرض الأسئلة فقط؛ الإجابة والتصحيح في المرحلة التالية. باقي الأسئلة Coming Soon.</span></div>
  </>}
 </article>;
}

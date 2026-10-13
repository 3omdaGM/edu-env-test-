import React, {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight, Clock3} from 'lucide-react';

const tabs = [['overview','وصف الاختبار'],['instructions','التعليمات'],['questions','الأسئلة المتاحة']];
const optionLetters = ['أ','ب','ج','د'];
const ordinalNumbers = ['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر'];

export default function AssessmentPage({assessment,baseRoute,tab='overview'}) {
 const [index,setIndex]=useState(0);
 useEffect(()=>setIndex(0),[assessment.id]);
 const selectedTab=tabs.some(([id])=>id===tab)?tab:'overview';
 const question=assessment.questions[index];
 const available=assessment.questions.length;
 const groups=assessment.questionSections;
 const group=groups?.find(g=>g.type===question.type);
 const groupQuestions=group?assessment.questions.filter(q=>q.type===group.type):assessment.questions;
 const groupIndex=groupQuestions.findIndex(q=>q.id===question.id);
 const questionNumber=group?groupIndex+1:index+1;
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
    {[[groups?'إجمالي الأسئلة الفرعية':'عدد الأسئلة',assessment.total],[groups?.[0].label||'اختيار من متعدد',assessment.multipleChoice],[groups?.[1].label||'صح وخطأ',assessment.trueFalse]].map(([label,count])=><div key={label}><strong>{count}</strong><span>{label}</span></div>)}
   </div>
   {groups&&<p className="assessment-structure">يتكون الاختبار من سؤالين رئيسيين: سؤال اختر يضم {assessment.multipleChoice} سؤالًا فرعيًا، وسؤال صح وخطأ يضم {assessment.trueFalse} عبارة.</p>}
   <p className="assessment-availability">المتاح حاليًا: <strong>{available} أسئلة</strong> من أصل {assessment.total}. باقي الأسئلة <span lang="en" dir="ltr">Coming Soon</span>.</p>
   <a className="button secondary" href={`#${baseRoute}/instructions`}>تعليمات الاختبار <ArrowLeft size={16}/></a>
  </>}
  {selectedTab==='instructions'&&<>
   <ol className="assessment-instructions">{assessment.instructions.map(item=><li key={item}>{item}</li>)}</ol>
   <div className="assessment-preview-note"><Clock3 size={16}/><span>عرض الأسئلة فقط؛ الإجابة والتصحيح في المرحلة التالية.</span></div>
   <a className="button secondary" href={`#${baseRoute}/questions`}>عرض الأسئلة المتاحة <ArrowLeft size={16}/></a>
  </>}
  {selectedTab==='questions'&&<>
   {groups&&<nav className="question-section-tabs" aria-label="قسما الاختبار القبلي العام">{groups.map(g=><button key={g.type} type="button" className={g.type===question.type?'selected':''} aria-pressed={g.type===question.type} onClick={()=>{const first=assessment.questions.findIndex(q=>q.type===g.type);if(first>=0)setIndex(first);}}>{g.label}<span>{g.count} {g.type==='choice'?'سؤال اختيار':'عبارة صح وخطأ'}</span></button>)}</nav>}
   {group&&<div className="question-section-heading"><h2>{group.title}</h2><p>المتاح في هذا القسم: {groupQuestions.length} من أصل {group.count}. باقي الأسئلة Coming Soon.</p></div>}
   <div className="question-preview" aria-live="polite">
    <div className="question-meta"><span>{group?`السؤال ${ordinalNumbers[groupIndex]||questionNumber} · ${questionNumber} من ${groupQuestions.length} أسئلة متاحة في هذا القسم`:`السؤال ${index+1} من ${available} أسئلة متاحة`}</span><span>{question.type==='choice'?'اختيار من متعدد':'صح وخطأ'}</span></div>
    <h2>{group&&<span className="question-local-number">{questionNumber}. </span>}{question.prompt}</h2>
    <ol className="question-options">{question.options.map((option,i)=><li key={option}><span aria-hidden="true">{question.type==='choice'?optionLetters[i]:i===0?'✓':'×'}</span><p>{option}</p></li>)}</ol>
   </div>
   <div className="question-preview-controls"><button type="button" className="button secondary" disabled={index===0} onClick={()=>setIndex(i=>i-1)}><ArrowRight size={16}/><span lang="en">Previous</span></button><span dir="ltr">{questionNumber} / {groupQuestions.length}</span><button type="button" className="button secondary" disabled={index===available-1} onClick={()=>setIndex(i=>i+1)}><span lang="en">Next</span><ArrowLeft size={16}/></button></div>
   <div className="assessment-preview-note"><Clock3 size={16}/><span>عرض الأسئلة فقط؛ الإجابة والتصحيح في المرحلة التالية. باقي الأسئلة Coming Soon.</span></div>
  </>}
 </article>;
}

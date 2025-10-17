
import { loadDB } from './utils.js';
import { Fields, levelOf, fmt, gapToExcellence } from './analysis.js';

function qs(name){ return new URLSearchParams(location.search).get(name); }
function hijriToday(){
  try{
    const fmtD = new Intl.DateTimeFormat('ar-SA-u-ca-islamic',{year:'numeric',month:'2-digit',day:'2-digit'});
    return fmtD.format(new Date());
  }catch{ return '1447/--/--'; }
}
function makeTopbar(){
  const top = document.createElement('div');
  top.className = 'topbar';
  top.innerHTML = `
    <div class="stack">
      <div>المملكة العربية السعودية</div>
      <div>وزارة التعليم</div>
      <div>الإدارة العامة للتعليم بالمنطقة الشرقية</div>
      <div>مدرسة اليعقوبي الثانوية</div>
    </div>
    <div class="logo"><img src="./assets/moe.png" alt="MoE"></div>
    <div class="date">${hijriToday()} هـ</div>
  `;
  return top;
}
function makeSection(title, html){
  const sec = document.createElement('section');
  sec.innerHTML = `<h3 style="margin:8px 0;color:#0b7e88">${title}</h3>${html}`;
  return sec;
}

function render(){
  const db = loadDB();
  const type = qs('type') || 'summary';
  const domain = qs('domain');

  const page = document.getElementById('page');
  page.innerHTML = '';
  page.appendChild(makeTopbar());

  const h1 = document.createElement('h1');
  h1.className = 'title';
  if(type==='field'){
    h1.textContent = `خطة تحسين مجال: ${Fields[domain]}`;
  }else{
    h1.textContent = 'الخطة التحسينية الشاملة – ثانوية اليعقوبي';
  }
  page.appendChild(h1);

  const body = document.createElement('div');
  body.className = 'body';

  function planRows(key){
    const v = db.metrics["2025"][key];
    const gap = gapToExcellence(v).toFixed(2);
    const rows = [
      {period:'1–5 أسابيع', kpi:'% إنجاز الخطة', owner:'قائد المدرسة'},
      {period:'6–10 أسابيع', kpi:'عدد الدروس النشطة/الأثر', owner:'وكلاء المدرسة'},
      {period:'11–14 أسابيع', kpi:'تحسن متوسط الأداء', owner:'لجنة نواتج التعلم'},
      {period:'15–18 أسابيع', kpi:'شراكات/سلامة/صيانة بحسب المجال', owner:'لجان المجال'}
    ];
    return `
      <p>المستوى الحالي: <strong>${levelOf(v).txt}</strong>، الفجوة إلى التميز: ${gap}%.</p>
      <table border="1" cellspacing="0" cellpadding="6" style="width:100%;border-collapse:collapse">
        <tr><th>الفترة</th><th>مؤشر القياس</th><th>المسؤول</th></tr>
        ${rows.map(r=>`<tr><td>${r.period}</td><td>${r.kpi}</td><td>${r.owner}</td></tr>`).join('')}
      </table>
    `;
  }

  if(type==='field'){
    body.appendChild(makeSection('الخطة القابلة للقياس', planRows(domain)));
    const evs = (db.evidence||[]).filter(e=>e.domain===domain);
    body.appendChild(makeSection('الشواهد المرتبطة', evs.length? `<ul>${evs.map(e=>`<li>${e.text||e.note||'—'} ${e.fileName?` — <em>${e.fileName}</em>`:''} — ${e.date||''}</li>`).join('')}</ul>`:'—'));
  }else{
    // summary plan
    const keys = Object.keys(Fields);
    keys.forEach(k=>{
      body.appendChild(makeSection(Fields[k], planRows(k)));
    });
  }

  page.appendChild(body);
  document.title = (type==='field')? `خطة_${Fields[domain]}_${hijriToday()}` : `الخطة_التحسينية_الشاملة_${hijriToday()}`;
}
render();

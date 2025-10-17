
import { loadDB } from './utils.js';
import { Fields, levelOf, fmt } from './analysis.js';

function hijriToday(){
  try{
    const fmtD = new Intl.DateTimeFormat('ar-SA-u-ca-islamic',{year:'numeric',month:'2-digit',day:'2-digit'});
    return fmtD.format(new Date());
  }catch{ return '1447/--/--'; }
}

function qs(name){ return new URLSearchParams(location.search).get(name); }

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
    h1.textContent = `تقرير مجال: ${Fields[domain]}`;
  }else{
    h1.textContent = 'التقرير الشامل – ثانوية اليعقوبي';
  }
  page.appendChild(h1);

  const body = document.createElement('div');
  body.className = 'body';

  if(type==='field'){
    const v24 = db.metrics["2024"][domain];
    const v25 = db.metrics["2025"][domain];
    const lvl = levelOf(v25);
    body.appendChild(makeSection('بيانات الأداء', `<p>2024: ${fmt(v24)}% — 2025: ${fmt(v25)}% — المستوى: <strong>${lvl.txt}</strong></p>`));

    const evs = (db.evidence||[]).filter(e=>e.domain===domain);
    body.appendChild(makeSection('الشواهد', evs.length? `<ul>${evs.map(e=>`<li>${e.text||e.note||'—'} ${e.fileName?` — <em>${e.fileName}</em>`:''} — ${e.date||''}</li>`).join('')}</ul>`:'لا توجد شواهد.'));

  }else{ // summary
    const v24 = db.metrics["2024"];
    const v25 = db.metrics["2025"];
    body.appendChild(makeSection('ملخص المجالات', `
      <ul>
        <li><strong>${Fields.management}:</strong> ${fmt(v24.management)}% → ${fmt(v25.management)}%</li>
        <li><strong>${Fields.teaching}:</strong> ${fmt(v24.teaching)}% → ${fmt(v25.teaching)}%</li>
        <li><strong>${Fields.learning}:</strong> ${fmt(v24.learning)}% → ${fmt(v25.learning)}%</li>
        <li><strong>${Fields.environment}:</strong> ${fmt(v24.environment)}% → ${fmt(v25.environment)}%</li>
      </ul>
    `));

    const evs = db.evidence||[];
    body.appendChild(makeSection('أبرز الشواهد الأخيرة', evs.length? `<ol>${evs.slice(-10).map(e=>`<li>[${Fields[e.domain]}] ${e.text||e.note||'—'} ${e.fileName?` — <em>${e.fileName}</em>`:''} — ${e.date||''}</li>`).join('')}</ol>`:'—'));
  }

  page.appendChild(body);

  // Auto print/download hint via title
  document.title = (type==='field')? `تقرير_${Fields[domain]}_${hijriToday()}` : `التقرير_الشامل_${hijriToday()}`;
}
render();

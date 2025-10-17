
import { ensureDB } from './database.js';
import { Fields, levelOf, fmt, gapToExcellence } from './analysis.js';

const db = ensureDB();

function cardTemplate(key, v24, v25){
  const {txt,color}=levelOf(v25);
  return `
    <article class="card" data-key="${key}">
      <h2>${Fields[key]}</h2>
      <div class="kpi"><span>2024: ${fmt(v24)}% → 2025: ${fmt(v25)}%</span><span class="badge">${txt}</span></div>
      <div class="progress"><div class="bar" style="width:${Math.max(2,v25)}%;background:${color}"></div></div>
      <div>الفجوة إلى التميز: ${fmt(gapToExcellence(v25))}%</div>
      <div class="kpi" style="margin-top:8px;gap:6px;flex-wrap:wrap">
        <a class="btn secondary" href="./report.html?type=field&domain=${key}" target="_blank">📄 تقرير المجال</a>
        <a class="btn secondary" href="./plan.html?type=field&domain=${key}" target="_blank">💡 خطة تحسين المجال</a>
        <a class="btn muted" href="./evidence.html?domain=${key}" target="_blank">📎 إضافة شاهد</a>
      </div>
    </article>`;
}

export function renderDashboard(){
  const wrap = document.getElementById('dashboard');
  wrap.innerHTML = '';
  const v24 = db.metrics["2024"];
  const v25 = db.metrics["2025"];
  Object.keys(Fields).forEach(key=>{
    wrap.insertAdjacentHTML('beforeend', cardTemplate(key, v24[key], v25[key]));
  });
}

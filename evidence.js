
import { loadDB, saveDB, initFirebaseIfEnabled } from './utils.js';
import { Fields } from './analysis.js';

const db = (()=>{ const d = loadDB(); d.evidence = d.evidence || []; return d; })();
const q = new URLSearchParams(location.search);
const domain = q.get('domain') || 'management';

document.getElementById('domain').value = domain;

document.getElementById('file').addEventListener('change', (e)=>{
  const f = e.target.files?.[0];
  document.getElementById('fileMsg').textContent = f? `تم اختيار: ${f.name}` : 'لم يتم اختيار ملف…';
});

document.getElementById('btnSave').addEventListener('click', async ()=>{
  const text = document.getElementById('text').value.trim();
  const week = document.getElementById('week').value;
  const dom = document.getElementById('domain').value;
  const f = document.getElementById('file').files?.[0]||null;

  if(!text && !f){ alert('أضف وصفاً أو ملفاً للشاهد'); return; }

  let fileName=null, fileType=null, dataURL=null, url=null;
  if(f){
    fileName = f.name; fileType = f.type;
    // try Firebase first
    try{
      const fb = await initFirebaseIfEnabled();
      if(fb){
        const path = `evidence/${Date.now()}_${fileName}`;
        const r = fb.ref(fb.storage, path);
        await fb.uploadBytes(r, f);
        url = await fb.getDownloadURL(r);
      }else{
        // fallback to base64
        dataURL = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(f); });
      }
    }catch(e){
      // fallback base64 on any error
      dataURL = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(f); });
    }
  }

  db.evidence.push({ id: Date.now(), domain: dom, text, fileName, fileType, dataURL, url, date: new Intl.DateTimeFormat('ar-SA-u-ca-islamic',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()) });
  saveDB(db);
  document.getElementById('text').value=''; document.getElementById('file').value=''; document.getElementById('fileMsg').textContent='تم الحفظ ✅';

  renderList();
});

function renderList(){
  const list = document.getElementById('list');
  const dom = document.getElementById('domain').value;
  const items = (db.evidence||[]).filter(e=>e.domain===dom).slice(-15);
  if(!items.length){ list.innerHTML = '<small class="muted">لا توجد شواهد بعد</small>'; return; }
  list.innerHTML = items.map(e=>`<li>• ${e.date} — ${e.text||'—'} ${e.fileName?` — <a href="${e.url || e.dataURL || '#'}" target="_blank">${e.fileName}</a>`:''}</li>`).join('');
}
document.getElementById('domain').addEventListener('change', renderList);
renderList();

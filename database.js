
import { loadDB, saveDB } from './utils.js';

// Embedded internal datasets (can be extended by parsing PDFs later)
export const InternalData = {
  school: "ثانوية اليعقوبي",
  year1447: true,
  metrics: {
    2024: { management:75.50, teaching:80.75, learning:78.50, environment:64.00 },
    2025: { management:75.50, teaching:81.50, learning:78.50, environment:62.25 }
  },
  // Sub-indicators can be expanded later
  subIndicators: {
    management: [
      {id:'plans_followup', name:'متابعة الخطة التشغيلية'},
      {id:'licenses', name:'الرخص المهنية'},
      {id:'leadership', name:'القيادة والتطوير'},
      {id:'community', name:'الشراكة المجتمعية'}
    ],
    teaching: [
      {id:'strategies', name:'الاستراتيجيات النشطة'},
      {id:'assessment', name:'تقويم التعلم'},
      {id:'edtech', name:'التعلّم الرقمي'}
    ],
    learning: [
      {id:'achievement', name:'التحصيل في المواد الأساسية'},
      {id:'skills', name:'المهارات الشخصية والعاطفية'}
    ],
    environment: [
      {id:'safety', name:'الأمن والسلامة'},
      {id:'maintenance', name:'الصيانة والنظافة'}
    ]
  },
  // Improvement suggestions (derived generically from ministry guides)
  solutions: {
    management:[
      "لوحة متابعة أسبوعية للخطة التشغيلية بمؤشرات أداء",
      "برنامج الرخص المهنية والتحفيز",
      "توسيع الشراكة المجتمعية الفاعلة"
    ],
    teaching:[
      "تطبيق استراتيجيات نشطة أسبوعيًا",
      "تقويمات بنائية متنوعة وتغذية راجعة",
      "دمج التعلم الإلكتروني اليومي"
    ],
    learning:[
      "برامج علاجية للمواد الأساسية",
      "اختبارات قصيرة أسبوعية شبيهة بالوطنية",
      "برامج إثرائية للمتفوقين"
    ],
    environment:[
      "جولات سلامة أسبوعية",
      "برنامج نظافة وصيانة دورية",
      "مبادرات السلوك الإيجابي وخدمة المجتمع"
    ]
  }
};

// Seed local DB if empty
export function ensureDB(){
  const db = loadDB();
  if(!db.meta){
    db.meta = { school: InternalData.school, year1447: InternalData.year1447 };
    db.metrics = InternalData.metrics;
    db.subIndicators = InternalData.subIndicators;
    db.solutions = InternalData.solutions;
    db.evidence = []; // {id, domain, itemId?, text, fileName, fileType, dataURL?, url?, date}
    saveDB(db);
  }
  return db;
}

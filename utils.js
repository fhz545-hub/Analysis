
// Utils: Hijri date (browser Intl)
export function hijriToday(){
  try{
    const fmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic',{year:'numeric', month:'2-digit', day:'2-digit'});
    return fmt.format(new Date());
  }catch{ return '1447/--/--'; }
}
// Storage helpers
export const DB_KEY = 'yaqoubi_platform_db_v1';
export function loadDB(){
  try{ return JSON.parse(localStorage.getItem(DB_KEY)) || {}; }catch{ return {}; }
}
export function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }
// Firebase (optional) hooks
export const FirebaseConfig = {
  enabled: false, // ← اجعلها true بعد ضبط المفاتيح
  options: {
    apiKey: "<YOUR_API_KEY>",
    authDomain: "<YOUR_AUTH_DOMAIN>",
    projectId: "<YOUR_PROJECT_ID>",
    storageBucket: "<YOUR_STORAGE_BUCKET>",
    messagingSenderId: "<YOUR_SENDER_ID>",
    appId: "<YOUR_APP_ID>"
  }
};
export async function initFirebaseIfEnabled(){
  if(!FirebaseConfig.enabled) return null;
  // dynamic import to avoid blocking when disabled
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
  const { getFirestore, doc, setDoc, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
  const { getStorage, ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js');
  const app = initializeApp(FirebaseConfig.options);
  const db = getFirestore(app);
  const storage = getStorage(app);
  return { app, db, storage, doc, setDoc, collection, addDoc, ref, uploadBytes, getDownloadURL };
}

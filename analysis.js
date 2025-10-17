
export const Fields = {
  management:'الإدارة المدرسية',
  teaching:'التعليم والتعلم',
  learning:'نواتج التعلم',
  environment:'البيئة المدرسية'
};
export function levelOf(v){
  if(v>=90) return {txt:'تميّز', color:'#10b981'};
  if(v>=75) return {txt:'تقدّم', color:'#35bfa3'};
  if(v>=50) return {txt:'انطلاق', color:'#ffb347'};
  return {txt:'تهيئة', color:'#ff4d4d'};
}
export const fmt = (v)=>Number(v).toFixed(2);
export function gapToExcellence(v){ return Math.max(0, 90 - v); }

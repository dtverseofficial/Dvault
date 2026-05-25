export const $ = (s, r=document) => r.querySelector(s);
export const $$ = (s, r=document) => [...r.querySelectorAll(s)];
export const esc = (v='') => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const pageName = () => document.body.dataset.page || location.pathname.split('/').pop().replace('.html','') || 'dashboard';
export const fmtDate = d => d ? new Date(d).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}) : '—';
export const debounce = (fn, ms=250) => { let t; return (...a)=>{clearTimeout(t); t=setTimeout(()=>fn(...a),ms)} };
export function toast(message, type='success'){
  const root = $('#toastRoot') || document.body.appendChild(Object.assign(document.createElement('div'),{id:'toastRoot',className:'toast-root'}));
  const el = document.createElement('div'); el.className = `toast ${type}`; el.textContent = message; root.appendChild(el);
  setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(10px)';setTimeout(()=>el.remove(),250)},3000);
}
export function setLoading(btn, loading=true, text='Saving...'){
  if(!btn) return; if(loading){btn.dataset.old=btn.textContent; btn.textContent=text; btn.disabled=true}else{btn.textContent=btn.dataset.old || 'Save'; btn.disabled=false}
}
export function downloadJSON(filename, data){
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const a = Object.assign(document.createElement('a'), {href:URL.createObjectURL(blob), download:filename});
  a.click(); URL.revokeObjectURL(a.href);
}

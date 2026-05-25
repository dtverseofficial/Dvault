const KEY = 'mv_offline_data';
export const TABLES = ['identities','accounts','revisit_items','courses','projects','tags','attachments','activity_logs','archives','profiles'];
export const isOffline = () => localStorage.getItem('mv_mode') === 'offline';
export const offlineUser = () => ({ id:'offline-user', email: localStorage.getItem('mv_offline_user') || 'Offline User' });
function seed(){ return {identities:[],accounts:[],revisit_items:[],courses:[],projects:[],tags:[],attachments:[],activity_logs:[],archives:[],profiles:[]}; }
export function readStore(){
  try{ return {...seed(), ...(JSON.parse(localStorage.getItem(KEY)||'{}'))}; }
  catch{ return seed(); }
}
export function writeStore(data){ localStorage.setItem(KEY, JSON.stringify({...seed(), ...data})); }
export function uid(){ return crypto.randomUUID ? crypto.randomUUID() : 'id-'+Date.now()+'-'+Math.random().toString(16).slice(2); }
export function list(table){ return [...(readStore()[table]||[])].sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||''))); }
export function get(table,id){ return (readStore()[table]||[]).find(x=>x.id===id) || null; }
export function insert(table,row){ const data=readStore(); const item={id:uid(), user_id:'offline-user', created_at:new Date().toISOString(), ...row}; data[table].unshift(item); writeStore(data); return item; }
export function update(table,id,patch){ const data=readStore(); data[table]=(data[table]||[]).map(x=>x.id===id?{...x,...patch}:x); writeStore(data); return get(table,id); }
export function remove(table,id){ const data=readStore(); const row=(data[table]||[]).find(x=>x.id===id); data[table]=(data[table]||[]).filter(x=>x.id!==id); writeStore(data); return row; }
export function log(action, entity_type, title=''){ insert('activity_logs',{action,entity_type,title}); }
export function exportData(){ return {mode:'offline', exported_at:new Date().toISOString(), ...readStore()}; }
export function importData(json){ const data = typeof json === 'string' ? JSON.parse(json) : json; const out=seed(); TABLES.forEach(t=>{ out[t]=Array.isArray(data[t]) ? data[t] : []; }); writeStore(out); return out; }
export function fileToDataUrl(file){ return new Promise((resolve,reject)=>{ const r=new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(file); }); }

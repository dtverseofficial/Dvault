import './auth.js';
import { db, getUser, SUPABASE_CONFIGURED } from './supabase.js';
import { $, pageName, toast, setLoading, downloadJSON, debounce } from './utils.js';
import { mountLayout } from './sidebar.js';
import { initGlobalSearch } from './search.js';
import { renderDashboard } from './dashboard.js';
import { modules, renderPageHeader, renderToolbar, renderEmpty, cardFor, buildModal, wireModals, renderDetailModal, renderEditModal } from './ui.js';
import * as local from './localdb.js';

let USER, currentKey;
const OFF = local.isOffline();

async function boot(){
  if(!OFF && (!db || !SUPABASE_CONFIGURED)){
    location.href = 'index.html';
    return;
  }
  await mountLayout(); initGlobalSearch(); wireModals();
  USER = OFF ? local.offlineUser() : await getUser();
  if(!USER && !OFF){ location.href = 'index.html'; return; }
  currentKey = pageName();
  if(currentKey === 'dashboard') return renderDashboard();
  if(currentKey === 'settings') return renderSettings();
  renderModule(currentKey);
}
boot().catch(err=>{ console.error(err); toast(err.message,'error'); });

async function renderModule(key){
  const root=$('#app'), cfg=modules[key]; if(!cfg) return;
  const identities = key==='accounts' ? await listRows('identities') : [];
  root.innerHTML = renderPageHeader(key)+renderToolbar(key)+`<div id="list" class="grid"></div>`+buildModal(key, identities);
  await loadItems(key);
  $('#pageSearch')?.addEventListener('input', debounce(()=>loadItems(key),200));
  $('#statusFilter')?.addEventListener('change',()=>loadItems(key));
  root.addEventListener('submit', onSubmit);
  root.addEventListener('click', onAction);
}

async function listRows(key){
  const table = modules[key]?.table || key;
  if(OFF) return local.list(table);
  const {data=[],error}=await db.from(table).select('*').eq('user_id',USER.id).order('created_at',{ascending:false});
  if(error) throw error; return data;
}
async function loadItems(key){
  const cfg=modules[key], list=$('#list'); if(!list) return; list.innerHTML='<div class="glass-card empty">Loading...</div>';
  if(key==='activity') return loadActivity();
  if(key==='archive') return loadArchive();
  const s=$('#pageSearch')?.value?.trim()?.toLowerCase() || '';
  let data = await listRows(key);
  if(s){ data = data.filter(r => JSON.stringify(r).toLowerCase().includes(s)); }
  if(key==='accounts' && $('#statusFilter')?.value) data=data.filter(r=>r.status===$('#statusFilter').value);
  list.innerHTML = data?.length ? data.map(r=>cardFor(key,r)).join('') : renderEmpty(key);
}
async function loadActivity(){
  const data = OFF ? local.list('activity_logs') : ((await db.from('activity_logs').select('*').eq('user_id',USER.id).order('created_at',{ascending:false})).data || []);
  $('#list').innerHTML = data.length ? data.map(r=>cardFor('activity',r)).join('') : renderEmpty('activity');
}
async function loadArchive(){
  const data = OFF ? local.list('archives') : ((await db.from('archives').select('*').eq('user_id',USER.id).order('created_at',{ascending:false})).data || []);
  $('#list').innerHTML = data.length ? data.map(r=>cardFor('archive',r)).join('') : renderEmpty('archive');
}
async function onSubmit(e){
  const form=e.target.closest('[data-form]');
  const editForm=e.target.closest('[data-edit-form]');
  if(editForm) return onEditSubmit(e, editForm);
  if(!form) return; e.preventDefault(); const key=form.dataset.form, cfg=modules[key], btn=e.submitter; setLoading(btn,true,'Creating...');
  const fd=new FormData(form); let payload={user_id:USER.id};
  try{
    if(key==='attachments'){
      const file=fd.get('file'); if(!file || !file.name) throw new Error('Choose a file first.');
      if(OFF){
        payload={user_id:USER.id,file_name:file.name,file_path:'local',file_data:await local.fileToDataUrl(file),mime_type:file.type,size_bytes:file.size,description:fd.get('description')};
      }else{
        const safeName = file.name.replace(/[^a-z0-9._-]/gi,'_');
        const path=`${USER.id}/${Date.now()}-${safeName}`;
        const up=await db.storage.from('vault-attachments').upload(path,file,{upsert:false,contentType:file.type}); if(up.error) throw up.error;
        payload={user_id:USER.id,file_name:file.name,file_path:path,mime_type:file.type,size_bytes:file.size,description:fd.get('description')};
      }
    } else {
      for(const [k,v] of fd.entries()) if(v !== '') payload[k]=v;
      if(payload.progress) payload.progress = Number(payload.progress);
    }
    if(OFF) local.insert(cfg.table,payload); else { const {error}=await db.from(cfg.table).insert(payload); if(error) throw error; }
    await log(`Created ${cfg.title.replace(/s$/,'').toLowerCase()}`, cfg.table, payload.email||payload.service_name||payload.title||payload.name||payload.file_name);
    form.reset(); form.closest('.modal').classList.remove('show'); toast('Saved'); loadItems(key);
  }catch(err){toast(err.message,'error')} finally{setLoading(btn,false)}
}
async function onEditSubmit(e, form){
  e.preventDefault(); const key=form.dataset.editForm, cfg=modules[key], id=form.dataset.id, btn=e.submitter; setLoading(btn,true,'Saving...');
  const fd=new FormData(form), payload={};
  for(const [k,v] of fd.entries()) payload[k] = v === '' ? null : v;
  if(payload.progress !== undefined) payload.progress = Number(payload.progress || 0);
  try{
    if(OFF) local.update(cfg.table,id,payload); else { const {error}=await db.from(cfg.table).update(payload).eq('id',id).eq('user_id',USER.id); if(error) throw error; }
    await log('Updated item', cfg.table); toast('Updated'); form.closest('.modal')?.remove(); await loadItems(key);
  }catch(err){toast(err.message,'error')} finally{setLoading(btn,false)}
}
async function onAction(e){
  const forcedId = e.target.closest('[data-id-force]')?.dataset.idForce;
  const view=e.target.closest('[data-view]'), edit=e.target.closest('[data-edit]'), del=e.target.closest('[data-delete]'), arch=e.target.closest('[data-archive]'), unarch=e.target.closest('[data-unarchive]'), fileDown=e.target.closest('[data-file-download]');
  if(fileDown){ return openAttachment(fileDown.dataset.fileDownload, true); }
  if(view || edit){
    const btn=view||edit, key=btn.dataset.view||btn.dataset.edit, id=forcedId || btn.closest('[data-id]')?.dataset.id, row=await getRow(key,id);
    if(!row) return toast('Item not found','error');
    if(edit){ $('#detailModal')?.remove(); document.body.insertAdjacentHTML('beforeend', renderEditModal(key,row)); }
    else { const url = key==='attachments' ? await signedUrl(row) : ''; document.body.insertAdjacentHTML('beforeend', renderDetailModal(key,row,url)); }
    return;
  }
  if(unarch){ await unarchiveItem(unarch.closest('[data-id]').dataset.id); return loadItems('archive'); }
  if(!del && !arch) return; const btn=del||arch, key=btn.dataset.delete||btn.dataset.archive, id=btn.closest('[data-id]').dataset.id, cfg=modules[key];
  if(arch){ const row=await getRow(key,id); if(OFF){ local.insert('archives',{entity_type:cfg.table,entity_id:id,title:titleOf(row),item_data:row}); local.remove(cfg.table,id); } else { await db.from('archives').insert({user_id:USER.id,entity_type:cfg.table,entity_id:id,title:titleOf(row),item_data:row}); await db.from(cfg.table).delete().eq('id',id); } await log('Archived item',cfg.table,titleOf(row)); toast('Archived'); }
  if(del && confirm('Delete this item permanently?')){ if(OFF) local.remove(cfg.table,id); else await db.from(cfg.table).delete().eq('id',id); await log('Deleted item',cfg.table); toast('Deleted'); }
  loadItems(key);
}
async function unarchiveItem(id){
  const row = OFF ? local.get('archives',id) : (await db.from('archives').select('*').eq('id',id).eq('user_id',USER.id).single()).data;
  if(!row) return toast('Archive item not found','error');
  const table = row.entity_type; const data = row.item_data || {};
  try{
    if(OFF){ local.insert(table,{...data, id:data.id || undefined, user_id:USER.id, created_at:data.created_at || new Date().toISOString()}); local.remove('archives',id); }
    else { const {error}=await db.from(table).insert({...data,user_id:USER.id}); if(error) throw error; await db.from('archives').delete().eq('id',id).eq('user_id',USER.id); }
    await log('Unarchived item', table, row.title); toast('Unarchived');
  }catch(err){ toast(err.message,'error'); }
}
function titleOf(row={}){ return row.email||row.service_name||row.title||row.name||row.file_name||'Vault item'; }
async function getRow(key,id){
  const table=modules[key].table;
  if(OFF) return local.get(table,id);
  const {data,error}=await db.from(table).select('*').eq('id',id).eq('user_id',USER.id).single(); if(error) console.error(error); return data;
}
async function signedUrl(row){
  if(OFF) return row.file_data || '';
  const {data,error}=await db.storage.from('vault-attachments').createSignedUrl(row.file_path,60*10); if(error){ toast(error.message,'error'); return ''; } return data.signedUrl;
}
async function openAttachment(id,download=false){
  const row = await getRow('attachments', id); if(!row) return toast('File not found','error');
  const url = await signedUrl(row); if(!url) return;
  if(download){ const a=document.createElement('a'); a.href=url; a.download=row.file_name; document.body.appendChild(a); a.click(); a.remove(); }
  else document.body.insertAdjacentHTML('beforeend', renderDetailModal('attachments', row, url));
}
async function log(action, entity_type, title=''){
  if(OFF) return local.log(action, entity_type, title);
  await db.from('activity_logs').insert({user_id:USER.id, action, entity_type, title});
}
async function renderSettings(){
  const root=$('#app');
  const profile = OFF ? {display_name:USER.email} : ((await db.from('profiles').select('*').eq('user_id',USER.id).maybeSingle()).data || {});
  root.innerHTML = `${renderPageHeader('settings')}<section class="section-card glass-card"><h2>Profile</h2><form id="profileForm" class="form-grid"><div class="field"><label>${OFF?'Offline username':'Email'}<input value="${USER.email}" ${OFF?'name="display_name"':'disabled'}></label></div>${OFF?'':'<div class="field"><label>Display name<input name="display_name" value="'+(profile?.display_name||USER.user_metadata?.display_name||'')+'"></label></div>'}<button class="btn primary" type="submit">Save</button></form></section><section class="section-card glass-card"><h2>Backup & restore</h2><p class="muted">${OFF?'Offline backup exports everything saved in localStorage.':'Cloud backup exports your Supabase rows as JSON.'}</p><div class="settings-actions"><button id="exportBtn" class="btn ghost">Export JSON backup</button><label class="btn ghost file-label">Restore JSON<input id="importFile" type="file" accept="application/json" hidden></label></div></section><section class="section-card glass-card"><h2>${OFF?'Offline privacy':'Security'}</h2><p class="muted">${OFF?'Offline mode never sends vault data to Supabase. It stays in this browser only, so take regular backups.':'Your database rows are protected by user-based Row Level Security. For passwords, store hints only, not raw passwords.'}</p></section>`;
  $('#profileForm').addEventListener('submit', async e=>{e.preventDefault(); if(OFF){ localStorage.setItem('mv_offline_user', new FormData(e.target).get('display_name') || 'Offline User'); toast('Offline name saved'); return; } const display_name=new FormData(e.target).get('display_name'); const {error}=await db.from('profiles').upsert({id:USER.id,user_id:USER.id,email:USER.email,display_name}); error?toast(error.message,'error'):toast('Profile saved');});
  $('#exportBtn').addEventListener('click', exportAll);
  $('#importFile').addEventListener('change', restoreBackup);
}
async function exportAll(){
  if(OFF) return downloadJSON('memory-vault-offline-backup.json', local.exportData());
  const out={exported_at:new Date().toISOString()};
  for(const key of ['identities','accounts','revisit_items','courses','projects','tags','attachments','activity_logs','archives']) out[key]=(await db.from(key).select('*').eq('user_id',USER.id)).data||[];
  downloadJSON('memory-vault-cloud-backup.json', out);
}
async function restoreBackup(e){
  const file=e.target.files?.[0]; if(!file) return;
  try{
    const data=JSON.parse(await file.text());
    if(OFF){ local.importData(data); toast('Offline backup restored'); location.reload(); return; }
    toast('Cloud restore is intentionally disabled. Use offline mode for local restore, or import via Supabase carefully.','error');
  }catch(err){ toast('Invalid backup file','error'); }
}

import { db, getUser } from './supabase.js';
import { debounce, esc } from './utils.js';
import { isOffline, readStore, offlineUser } from './localdb.js';
const searchable = [
 ['identities','Identities','identities.html',['email','username','purpose','notes']],
 ['accounts','Accounts','accounts.html',['service_name','website_url','username','category','notes']],
 ['revisit_items','Revisit','revisit.html',['title','description','priority','status']],
 ['courses','Courses','courses.html',['name','platform','url','notes']],
 ['projects','Projects','projects.html',['name','description','repo_url','live_url','tech_stack']],
 ['tags','Tags','tags.html',['name','description','color']],
 ['attachments','Attachments','attachments.html',['file_name','description','mime_type']],
 ['archives','Archive','archive.html',['title','entity_type']]
];
export function initGlobalSearch(){
  const input = document.getElementById('globalSearch'), panel=document.getElementById('globalResults'); if(!input || !panel) return;
  input.addEventListener('input', debounce(()=>run(input.value.trim(), panel), 220));
  input.addEventListener('focus',()=>{ if(input.value.trim()) run(input.value.trim(), panel); });
  document.addEventListener('click',e=>{ if(!e.target.closest('.global-search')) panel.classList.remove('show'); });
  input.addEventListener('keydown', e=>{ if(e.key==='Escape') panel.classList.remove('show'); });
}
async function run(q,panel){
  if(!q){ panel.classList.remove('show'); panel.innerHTML=''; return; }
  const hits=[];
  if(isOffline()){
    const data=readStore();
    for(const [table,label,url,cols] of searchable){
      (data[table]||[]).forEach(r=>{ const hay=cols.map(c=>r[c]||'').join(' ').toLowerCase(); if(hay.includes(q.toLowerCase())) hits.push({label,url,title:titleOf(r),desc:descOf(r)}); });
    }
  }else{
    const user=await getUser();
    for(const [table,label,url,cols] of searchable){
      const { data=[] } = await db.from(table).select('*').eq('user_id',user.id).limit(25);
      data.forEach(r=>{ const hay=cols.map(c=>r[c]||'').join(' ').toLowerCase(); if(hay.includes(q.toLowerCase())) hits.push({label,url,title:titleOf(r),desc:descOf(r)}); });
    }
  }
  panel.innerHTML = hits.length ? hits.slice(0,12).map(h=>`<a class="global-result" href="${h.url}"><span class="pill">${esc(h.label)}</span><strong>${esc(h.title)}</strong><small>${esc(h.desc||'')}</small></a>`).join('') : `<div class="global-empty">No result found</div>`;
  panel.classList.add('show');
}
function titleOf(r){ return r.email||r.service_name||r.title||r.name||r.file_name||r.action||r.entity_type||'Untitled'; }
function descOf(r){ return r.notes||r.description||r.website_url||r.platform||r.category||''; }

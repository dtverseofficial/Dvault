import { db, getUser } from './supabase.js';
import { $, esc } from './utils.js';
import { isOffline, readStore, offlineUser } from './localdb.js';
import { vaultIcon } from './ui.js';
const stats = [['identities','Identities','identity'],['accounts','Accounts','account'],['revisit_items','Revisit Items','revisit'],['accounts','Inactive Accounts','archive','inactive']];
export async function renderDashboard(){
  const user = isOffline()?offlineUser():await getUser(); const root=$('#app');
  root.innerHTML = `<div class="page-head slide-up"><div><h1>Dashboard</h1><p>${isOffline()?'Offline vault active. Data stays in this browser.':'Your digital life at a glance.'}</p></div><button class="btn primary" onclick="location.href='accounts.html'">${vaultIcon('new')}<span>Quick add account</span></button></div><div class="stat-grid" id="stats"></div><section class="section-card glass-card"><h2 class="section-title">${vaultIcon('activity')}<span>Recent activity</span></h2><div id="activityList">Loading...</div></section><section class="section-card glass-card"><h2 class="section-title">${vaultIcon('new')}<span>Recently added</span></h2><div id="recentList">Loading...</div></section>`;
  let cards=[];
  if(isOffline()){
    const data=readStore();
    cards=stats.map(s=>{ const list=data[s[0]]||[]; const count=s[3]?list.filter(x=>x.status===s[3]).length:list.length; return statCard(s[1],s[2],count); });
    $('#activityList').innerHTML = (data.activity_logs||[]).slice(0,6).map(a=>`<p><b>${esc(a.action)}</b> <span class="pill">${esc(a.entity_type||'vault')}</span></p>`).join('') || '<div class="empty small"><p>No activity yet.</p></div>';
    $('#recentList').innerHTML = (data.accounts||[]).slice(0,4).map(r=>`<p><b>${esc(r.service_name)}</b><br><span class="muted">${esc(r.website_url||r.username||'')}</span></p>`).join('') || '<div class="empty small"><p>Nothing yet.</p></div>';
  }else{
    cards = await Promise.all(stats.map(async s=>{ let q = db.from(s[0]).select('id', {count:'exact', head:true}).eq('user_id',user.id); if(s[3]) q=q.eq('status',s[3]); const { count } = await q; return statCard(s[1],s[2],count||0); }));
    const { data: acts=[] } = await db.from('activity_logs').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(6);
    $('#activityList').innerHTML = acts.length ? acts.map(a=>`<p><b>${esc(a.action)}</b> <span class="pill">${esc(a.entity_type||'vault')}</span></p>`).join('') : '<div class="empty small"><p>No activity yet.</p></div>';
    const { data: recent=[] } = await db.from('accounts').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(4);
    $('#recentList').innerHTML = recent.length ? recent.map(r=>`<p><b>${esc(r.service_name)}</b><br><span class="muted">${esc(r.website_url||r.username||'')}</span></p>`).join('') : '<div class="empty small"><p>Nothing yet.</p></div>';
  }
  $('#stats').innerHTML=cards.join('');
}
function statCard(label,icon,count){ return `<article class="stat-card glass-card"><small>${label} ${vaultIcon(icon)}</small><strong>${count}</strong></article>`; }

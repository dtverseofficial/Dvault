import { db, getUser } from './supabase.js';
import { $, pageName } from './utils.js';
import { isOffline, offlineUser } from './localdb.js';
import { vaultIcon } from './ui.js';

const links = [
 ['dashboard','Dashboard','dashboard'],['identities','Identities','identity'],['accounts','Accounts','account'],['revisit','Revisit Later','revisit'],['courses','Courses','course'],['projects','Projects','project'],['tags','Tags','tag'],['attachments','Attachments','attachment'],['activity','Activity Logs','activity'],['archive','Archive','archive'],['settings','Settings','settings']
];
export async function mountLayout(){
  const current = pageName();
  document.body.insertAdjacentHTML('afterbegin', `<div class="bg-orbs"><span></span><span></span><span></span></div><div class="overlay" id="overlay"></div><aside class="sidebar" id="sidebar"><div class="brand"><div class="brand-icon">${vaultIcon('vault')}</div><div><strong>Dvault</strong><span>${isOffline()?'OFFLINE MODE':'DIGITAL LIFE OS'}</span></div></div><nav class="nav-all">${links.map(l=>nav(l,current)).join('')}</nav><div class="sidebar-footer"><button id="logoutBtn" class="nav-link signout" style="width:100%;border:0;background:transparent"><span>${vaultIcon('signout')}</span><b>${isOffline()?'Exit offline':'Sign out'}</b></button></div></aside><header class="topbar"><button class="btn ghost menu-btn" id="menuBtn">${vaultIcon('menu')}<span>Menu</span></button><div class="search global-search"><input id="globalSearch" autocomplete="off" placeholder="Search everything across all categories..."><div id="globalResults" class="global-results"></div></div><span class="user-chip" id="userChip">Vault</span></header>`);
  $('#menuBtn')?.addEventListener('click',()=>toggle(true)); $('#overlay')?.addEventListener('click',()=>toggle(false));
  $('#logoutBtn')?.addEventListener('click', async()=>{
    if(isOffline()){
      localStorage.removeItem('mv_mode');
      location.href='index.html';
      return;
    }
    if(db) await db.auth.signOut();
    location.href='index.html';
  });
  const user = isOffline() ? offlineUser() : await getUser().catch(()=>null); if(user) $('#userChip').textContent = user.email;
}
function nav(l,current){ return `<a class="nav-link ${l[0]===current?'active':''}" href="${l[0]}.html">${vaultIcon(l[2])}<b>${l[1]}</b></a>`; }
function toggle(show){ $('#sidebar')?.classList.toggle('open',show); $('#overlay')?.classList.toggle('show',show); }

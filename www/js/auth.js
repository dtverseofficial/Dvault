import { $, $$, toast, setLoading } from './utils.js';

let db = null;
let supabaseReady = false;

async function loadSupabaseSafely(){
  try{
    const mod = await import('./supabase.js');
    db = mod.db;
    supabaseReady = !!mod.db && !!mod.SUPABASE_CONFIGURED;
    return mod;
  }catch(err){
    console.warn('Supabase is not ready:', err);
    supabaseReady = false;
    return null;
  }
}

function isAuthPage(){
  const page = location.pathname.split('/').pop() || 'index.html';
  return page === 'index.html' || location.pathname === '/' || location.pathname.endsWith('/memory-vault/');
}

function showAuthPanel(name){
  $$('.auth-tab').forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  $$('.auth-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.panel === name);
  });
}

function openOfflineVault(){
  const name = ($('#offlineName')?.value || '').trim() || 'Offline User';
  localStorage.setItem('mv_mode','offline');
  localStorage.setItem('mv_offline_user', name);

  if(!localStorage.getItem('mv_offline_data')){
    localStorage.setItem('mv_offline_data', JSON.stringify({
      identities:[],
      accounts:[],
      revisit_items:[],
      courses:[],
      projects:[],
      tags:[],
      attachments:[],
      activity_logs:[{
        id:crypto.randomUUID?.() || String(Date.now()),
        type:'offline',
        title:'Offline vault created',
        description:`Local vault opened for ${name}`,
        created_at:new Date().toISOString()
      }],
      archives:[],
      profiles:[]
    }));
  }

  location.href = 'dashboard.html';
}

function attachAuthEvents(){
  $$('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => showAuthPanel(tab.dataset.tab));
  });

  $('#signinForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    if(!supabaseReady || !db){
      toast('Supabase is not configured yet. Use Offline mode or add your Supabase URL and anon key in js/supabase.js.', 'error');
      return;
    }

    const btn = e.submitter;
    setLoading(btn,true,'Signing in...');
    const { error } = await db.auth.signInWithPassword({
      email: $('#signinEmail').value.trim(),
      password: $('#signinPassword').value
    });
    setLoading(btn,false);
    if(error) return toast(error.message,'error');
    localStorage.setItem('mv_mode','cloud');
    location.href='dashboard.html';
  });

  $('#signupForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    if(!supabaseReady || !db){
      toast('Supabase is not configured yet. Use Offline mode or add your Supabase URL and anon key in js/supabase.js.', 'error');
      return;
    }

    const btn = e.submitter;
    setLoading(btn,true,'Creating account...');
    const email = $('#signupEmail').value.trim();
    const password = $('#signupPassword').value;
    const display_name = $('#signupName').value.trim();
    const { data, error } = await db.auth.signUp({ email, password, options:{ data:{ display_name } } });
    if(!error && data.user){
      await db.from('profiles').upsert({ id:data.user.id, user_id:data.user.id, email, display_name });
    }
    setLoading(btn,false);
    if(error) return toast(error.message,'error');
    toast('Account created. Check email if confirmation is enabled.');
    showAuthPanel('signin');
  });

  $('#googleBtn')?.addEventListener('click', async () => {
    if(!supabaseReady || !db){
      toast('Supabase is not configured yet. Add your Supabase URL and anon key first.', 'error');
      return;
    }

    const { error } = await db.auth.signInWithOAuth({
      provider:'google',
      options:{ redirectTo: location.origin + location.pathname.replace('index.html','dashboard.html') }
    });
    if(error) toast(error.message,'error');
  });

  $('#offlineBtn')?.addEventListener('click', openOfflineVault);

  $('#offlineName')?.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
      e.preventDefault();
      openOfflineVault();
    }
  });
}

async function protectRoutes(){
  const offline = localStorage.getItem('mv_mode') === 'offline';

  if(offline){
    if(isAuthPage()) location.href = 'dashboard.html';
    return;
  }

  const mod = await loadSupabaseSafely();
  if(!mod || !mod.db || !mod.SUPABASE_CONFIGURED){
    if(!isAuthPage()) location.href = 'index.html';
    return;
  }

  const session = await mod.getSession().catch(()=>null);
  if(session && isAuthPage()) location.href = 'dashboard.html';
  if(!session && !isAuthPage()) location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  attachAuthEvents();
  showAuthPanel('signin');
  protectRoutes();
});

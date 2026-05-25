import { $, esc } from './utils.js';

export function vaultIcon(name, extraClass=''){
  const icons = {
    vault:'<path d="M24 5 40 13v11c0 10.5-6.8 16.6-16 20-9.2-3.4-16-9.5-16-20V13L24 5Z"/><path d="M18 24h12M24 18v12"/>',
    dashboard:'<path d="M6 20 24 7l18 13"/><path d="M12 19v20h24V19"/><path d="M19 39V27h10v12"/>',
    identity:'<rect x="8" y="10" width="32" height="28" rx="6"/><path d="M15 19h10M15 26h18M15 32h12"/><circle cx="32" cy="19" r="3"/>',
    account:'<circle cx="18" cy="16" r="6"/><path d="M7 38c2-8 7-12 15-12"/><path d="M30 27l4 4 8-9"/>',
    revisit:'<circle cx="24" cy="24" r="16"/><path d="M24 14v11l7 4"/>',
    course:'<path d="M8 14 24 7l16 7-16 7-16-7Z"/><path d="M14 19v10c4 5 16 5 20 0V19"/>',
    project:'<path d="M10 14h12l4 5h12v19H10V14Z"/><path d="M16 28h16"/>',
    tag:'<path d="M8 10h17l15 15-15 15L8 23V10Z"/><circle cx="18" cy="20" r="2.5"/>',
    attachment:'<path d="M17 25 29 13a7 7 0 0 1 10 10L23 39a10 10 0 0 1-14-14l17-17"/><path d="M18 30 32 16"/>',
    activity:'<path d="M6 27h8l5-13 8 24 5-11h10"/>',
    archive:'<path d="M9 13h30v8H9z"/><path d="M13 21v17h22V21"/><path d="M20 27h8"/>',
    settings:'<circle cx="24" cy="24" r="5"/><path d="M24 7v5M24 36v5M7 24h5M36 24h5M12 12l4 4M32 32l4 4M36 12l-4 4M16 32l-4 4"/>',
    view:'<path d="M5 24s7-12 19-12 19 12 19 12-7 12-19 12S5 24 5 24Z"/><circle cx="24" cy="24" r="5"/>',
    edit:'<path d="M10 34l2-9 18-18 7 7-18 18-9 2Z"/><path d="M27 10l7 7"/>',
    download:'<path d="M24 8v20"/><path d="M15 21l9 9 9-9"/><path d="M10 38h28"/>',
    restore:'<path d="M12 16a15 15 0 1 1-2 16"/><path d="M12 16H6v-6"/><path d="M24 15v10l7 4"/>',
    delete:'<path d="M10 14h28"/><path d="M18 14V9h12v5"/><path d="M14 14l2 25h16l2-25"/><path d="M21 21v11M27 21v11"/>',
    signout:'<path d="M20 9H10v30h10"/><path d="M26 16l8 8-8 8"/><path d="M16 24h18"/>',
    menu:'<path d="M9 15h30M9 24h30M9 33h30"/>',
    search:'<circle cx="21" cy="21" r="11"/><path d="M30 30l9 9"/>',
    new:'<path d="M24 8v32M8 24h32"/>'
  };
  return `<span class="svg-icon ${extraClass}" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${icons[name]||icons.vault}</svg></span>`;
}

export const modules = {
  identities:{table:'identities',title:'Identities',subtitle:'Email accounts, usernames, and recovery info you use across the web.',add:'New identity',empty:'No identities yet',emptyText:'Add email identities to keep track of which one you used where.',icon:'identity'},
  accounts:{table:'accounts',title:'Accounts',subtitle:"Every site, app and platform you've signed up for.",add:'New account',empty:'No accounts yet',emptyText:"Start tracking the services you've signed up for to never forget them again.",icon:'account'},
  revisit:{table:'revisit_items',title:'Revisit Later',subtitle:'Reminders for things to check or come back to.',add:'New reminder',empty:'Nothing to revisit yet',emptyText:'Add reminders for accounts, pages or projects you want to come back to.',icon:'revisit'},
  courses:{table:'courses',title:'Courses',subtitle:'Track learning across platforms and progress.',add:'New course',empty:'No courses yet',emptyText:"Track the courses you're taking or want to revisit.",icon:'course'},
  projects:{table:'projects',title:'Projects',subtitle:"Side projects, ideas, and what's shipped.",add:'New project',empty:'No projects yet',emptyText:'Capture project links, descriptions and ideas so nothing gets lost.',icon:'project'},
  tags:{table:'tags',title:'Tags',subtitle:'Reusable labels you can attach across the vault.',add:'New tag',empty:'No tags yet',emptyText:'Create color-coded tags to organise everything in your vault.',icon:'tag'},
  attachments:{table:'attachments',title:'Attachments',subtitle:'Files, screenshots, PDFs and certificates.',add:'Upload file',empty:'No files yet',emptyText:'Upload screenshots, PDFs or backups and reference them from anywhere.',icon:'attachment'},
  activity:{table:'activity_logs',title:'Activity Logs',subtitle:'A timeline of everything you do in the vault.',add:'',empty:'No activity yet',emptyText:'Your actions across the vault will appear here.',icon:'activity'},
  archive:{table:'archives',title:'Archive',subtitle:"Items you've archived. Restore or delete permanently.",add:'',empty:'No archived items',emptyText:'Archived items will show up here.',icon:'archive'},
  settings:{table:'profiles',title:'Settings',subtitle:'Profile, data and security.',add:'',empty:'',emptyText:'',icon:'settings'}
};

export const fieldMap = {
  identities:[['email','Email','email'],['username','Username','text'],['phone','Phone','text'],['recovery_email','Recovery email','email'],['purpose','Purpose','text'],['notes','Notes','textarea']],
  accounts:[['service_name','Service / Platform','text'],['website_url','Website URL','url'],['username','Username','text'],['category','Category','text'],['status','Status','select:active,inactive'],['revisit_date','Revisit date','date'],['notes','Notes','textarea']],
  revisit:[['title','Title','text'],['description','Description','textarea'],['due_date','Due date','date'],['priority','Priority','select:low,medium,high'],['status','Status','select:pending,done']],
  courses:[['name','Name','text'],['platform','Platform','text'],['url','URL','url'],['progress','Progress %','number'],['notes','Notes','textarea']],
  projects:[['name','Name','text'],['description','Description','textarea'],['repo_url','Repository URL','url'],['live_url','Deployment URL','url'],['tech_stack','Tech stack','text'],['status','Status','select:active,inactive,completed']],
  tags:[['name','Name','text'],['color','Color','color'],['description','Description','textarea']],
  attachments:[['file_name','File name','readonly'],['description','Description','textarea'],['mime_type','MIME type','readonly'],['size_bytes','Size','readonly']]
};

export function renderPageHeader(key){
  const cfg = modules[key];
  return `<div class="page-head slide-up"><div><h1>${cfg.title}</h1><p>${cfg.subtitle}</p></div>${cfg.add?`<button class="btn primary" data-open-modal="${key}">${vaultIcon('new')}<span>${cfg.add}</span></button>`:''}</div>`;
}
export function renderToolbar(key){
  if(['activity','archive','settings'].includes(key)) return '';
  return `<div class="toolbar"><div class="search"><input id="pageSearch" placeholder="Search ${modules[key].title.toLowerCase()}..."></div>${key==='accounts'?'<select id="statusFilter" class="btn ghost"><option value="">All statuses</option><option>active</option><option>inactive</option></select>':''}</div>`;
}
export function renderEmpty(key){
  const c=modules[key]; return `<div class="empty glass-card slide-up"><div>${vaultIcon(c.icon,'big')}<h2>${c.empty}</h2><p>${c.emptyText}</p>${c.add?`<button class="btn primary" data-open-modal="${key}">${vaultIcon('new')}<span>${c.add}</span></button>`:''}</div></div>`;
}
function formatBytes(n){ if(!n) return '—'; const u=['B','KB','MB','GB']; let i=0, x=Number(n); while(x>=1024&&i<u.length-1){x/=1024;i++} return `${x.toFixed(i?1:0)} ${u[i]}`; }
export function cardFor(key,row){
  const title = row.email || row.service_name || row.title || row.name || row.file_name || row.action || row.entity_type || 'Untitled';
  const desc = row.notes || row.description || row.website_url || row.platform || row.title || row.entity_type || '';
  const canEdit = !['activity','archive'].includes(key);
  const archiveActions = key==='archive' ? `<button class="icon-btn action-btn" data-unarchive title="Restore from archive">${vaultIcon('restore')}<span>Restore</span></button><button class="icon-btn action-btn danger" data-delete="archive" title="Delete archived item">${vaultIcon('delete')}<span>Delete</span></button>` : '';
  const normalActions = canEdit ? `<button class="icon-btn action-btn" data-view="${key}" title="View details">${vaultIcon('view')}<span>View details</span></button><button class="icon-btn action-btn" data-edit="${key}" title="Edit item">${vaultIcon('edit')}<span>Edit</span></button>${key==='attachments'?`<button class="icon-btn action-btn" data-file-download="${row.id}" title="Download file">${vaultIcon('download')}<span>Download</span></button>`:''}<button class="icon-btn action-btn" data-archive="${key}" title="Move to archive">${vaultIcon('archive')}<span>Archive</span></button><button class="icon-btn action-btn danger" data-delete="${key}" title="Delete item">${vaultIcon('delete')}<span>Delete</span></button>` : '';
  return `<article class="item-card glass-card slide-up" data-id="${row.id}">
    <div class="actions">${archiveActions}${normalActions}</div>
    <div class="card-title-row">${vaultIcon(modules[key]?.icon || 'vault')}<h3>${esc(title)}</h3></div><p>${esc(desc)}</p>
    <div class="item-meta">${row.category?`<span class="pill">${esc(row.category)}</span>`:''}${row.status?`<span class="pill">${esc(row.status)}</span>`:''}${row.priority?`<span class="pill">${esc(row.priority)}</span>`:''}${row.progress!=null?`<span class="pill">${row.progress}%</span>`:''}${key==='attachments'?`<span class="pill">${formatBytes(row.size_bytes)}</span>`:''}${row.created_at?`<span class="pill">${new Date(row.created_at).toLocaleDateString()}</span>`:''}</div>
  </article>`;
}
export function buildModal(key, identities=[]){
  const identityOptions = `<option value="">None</option>` + identities.map(i=>`<option value="${i.id}">${esc(i.email)}</option>`).join('');
  const fields = {
    identities:`<div class="field full-span"><label>Email *<input name="email" type="email" required></label></div><div class="field"><label>Username<input name="username"></label></div><div class="field"><label>Phone<input name="phone"></label></div><div class="field full-span"><label>Recovery email<input name="recovery_email" type="email"></label></div><div class="field full-span"><label>Purpose<input name="purpose" placeholder="Work, personal, throwaway..."></label></div><div class="field full-span"><label>Notes<textarea name="notes"></textarea></label></div>`,
    accounts:`<div class="field full-span"><label>Service / Platform *<input name="service_name" required></label></div><div class="field"><label>Website URL<input name="website_url" type="url" placeholder="https://..."></label></div><div class="field"><label>Username<input name="username"></label></div><div class="field"><label>Category<input name="category" placeholder="Work, social, dev..."></label></div><div class="field"><label>Status<select name="status"><option>active</option><option>inactive</option></select></label></div><div class="field"><label>Revisit date<input name="revisit_date" type="date"></label></div><div class="field full-span"><label>Linked identity<select name="identity_id">${identityOptions}</select></label></div><div class="field full-span"><label>Notes<textarea name="notes"></textarea></label></div>`,
    revisit:`<div class="field full-span"><label>Title *<input name="title" required></label></div><div class="field full-span"><label>Description<textarea name="description"></textarea></label></div><div class="field"><label>Due date<input name="due_date" type="date"></label></div><div class="field"><label>Priority<select name="priority"><option>low</option><option selected>medium</option><option>high</option></select></label></div>`,
    courses:`<div class="field full-span"><label>Name *<input name="name" required></label></div><div class="field"><label>Platform<input name="platform" placeholder="Udemy, YouTube..."></label></div><div class="field"><label>Progress %<input name="progress" type="number" min="0" max="100" value="0"></label></div><div class="field full-span"><label>URL<input name="url" type="url"></label></div><div class="field full-span"><label>Notes<textarea name="notes"></textarea></label></div>`,
    projects:`<div class="field full-span"><label>Name *<input name="name" required></label></div><div class="field full-span"><label>Description<textarea name="description"></textarea></label></div><div class="field"><label>Repository URL<input name="repo_url" type="url"></label></div><div class="field"><label>Deployment URL<input name="live_url" type="url"></label></div><div class="field full-span"><label>Tech stack<input name="tech_stack" placeholder="HTML, Supabase, JS"></label></div>`,
    tags:`<div class="field"><label>Name *<input name="name" required></label></div><div class="field"><label>Color<input name="color" type="color" value="#6ea8fe"></label></div><div class="field full-span"><label>Description<textarea name="description"></textarea></label></div>`,
    attachments:`<div class="field full-span"><label>File *<input name="file" type="file" required></label></div><div class="field full-span"><label>Description<textarea name="description"></textarea></label></div>`
  }[key];
  if(!fields) return '';
  return `<div class="modal" id="modal-${key}"><form class="modal-card" data-form="${key}"><div class="modal-head"><h2>${modules[key].add}</h2><button class="icon-btn" type="button" data-close-modal>×</button></div><div class="form-grid">${fields}</div><div class="form-actions"><button class="btn ghost" type="button" data-close-modal>Cancel</button><button class="btn primary" type="submit">Create</button></div></form></div>`;
}
export function renderDetailModal(key,row,fileUrl=''){
  const title = row.email || row.service_name || row.title || row.name || row.file_name || 'Details';
  const fields = (fieldMap[key]||[]).map(([name,label])=>{
    let v = row[name]; if(name==='size_bytes') v = formatBytes(v); if(!v) v='—';
    const isUrl = String(v).startsWith('http');
    return `<div class="detail-row"><span>${label}</span><strong>${isUrl?`<a href="${esc(v)}" target="_blank" rel="noopener">${esc(v)}</a>`:esc(String(v))}</strong></div>`;
  }).join('');
  const filePreview = key==='attachments' && fileUrl ? previewForFile(row,fileUrl) : '';
  return `<div class="modal show" id="detailModal"><div class="modal-card detail-card"><div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" type="button" data-close-modal>×</button></div>${filePreview}<div class="detail-grid">${fields}<div class="detail-row"><span>Created</span><strong>${new Date(row.created_at).toLocaleString()}</strong></div></div><div class="form-actions"><button class="btn ghost" type="button" data-close-modal>Close</button><button class="btn primary" type="button" data-edit="${key}" data-id-force="${row.id}">Edit</button></div></div></div>`;
}
function previewForFile(row,url){
  const mime = row.mime_type || '';
  if(mime.startsWith('image/')) return `<div class="file-preview"><img src="${url}" alt="${esc(row.file_name)}"></div>`;
  if(mime === 'application/pdf') return `<div class="file-preview"><iframe src="${url}" title="${esc(row.file_name)}"></iframe></div>`;
  return `<div class="file-preview simple"><p>${esc(row.file_name)}</p><a class="btn primary" href="${url}" target="_blank" rel="noopener">Open file</a></div>`;
}
export function renderEditModal(key,row){
  const title = row.email || row.service_name || row.title || row.name || row.file_name || 'Edit item';
  const fields=(fieldMap[key]||[]).filter(f=>f[2] !== 'readonly').map(([name,label,type])=>{
    const val = row[name] ?? '';
    if(type==='textarea') return `<div class="field full-span"><label>${label}<textarea name="${name}">${esc(String(val))}</textarea></label></div>`;
    if(type?.startsWith('select:')) return `<div class="field"><label>${label}<select name="${name}">${type.slice(7).split(',').map(o=>`<option ${String(val)===o?'selected':''}>${o}</option>`).join('')}</select></label></div>`;
    return `<div class="field ${['url','email'].includes(type)?'full-span':''}"><label>${label}<input name="${name}" type="${type||'text'}" value="${esc(String(val))}"></label></div>`;
  }).join('');
  return `<div class="modal show" id="editModal"><form class="modal-card" data-edit-form="${key}" data-id="${row.id}"><div class="modal-head"><h2>Edit ${esc(title)}</h2><button class="icon-btn" type="button" data-close-modal>×</button></div><div class="form-grid">${fields}</div><div class="form-actions"><button class="btn ghost" type="button" data-close-modal>Cancel</button><button class="btn primary" type="submit">Save changes</button></div></form></div>`;
}
export function wireModals(){
  document.addEventListener('click', e=>{
    const open=e.target.closest('[data-open-modal]'); if(open) $('#modal-'+open.dataset.openModal)?.classList.add('show');
    if(e.target.matches('[data-close-modal]') || e.target.classList.contains('modal')) e.target.closest('.modal')?.remove?.() || e.target.closest('.modal')?.classList.remove('show');
  });
}

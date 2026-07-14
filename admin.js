/* ============================================================
   KINGSLEY WEB STUDIO — Admin Panel Script
   ============================================================ */

const ADMIN_PASSWORD = 'Porto121';

/* ── Login ── */
function adminLogin() {
  const input = document.getElementById('login-password').value;
  const error = document.getElementById('login-error');
  if (input === ADMIN_PASSWORD) {
    sessionStorage.setItem('kws_admin', 'true');
    document.getElementById('login-screen').style.display    = 'none';
    document.getElementById('admin-dashboard').style.display = 'grid';
    loadAllData();
  } else {
    error.classList.add('show');
    document.getElementById('login-password').value = '';
  }
}

document.getElementById('login-password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') adminLogin();
});

function adminLogout() {
  sessionStorage.removeItem('kws_admin');
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('login-screen').style.display    = 'flex';
  document.getElementById('login-password').value = '';
}

// Auto-login if session exists
if (sessionStorage.getItem('kws_admin') === 'true') {
  document.getElementById('login-screen').style.display    = 'none';
  document.getElementById('admin-dashboard').style.display = 'grid';
  loadAllData();
}

/* ── Tab switching ── */
function showTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  event.currentTarget.classList.add('active');
}

/* ── Load all saved data into admin fields ── */
function loadAllData() {
  // About
  document.getElementById('admin-about-title').value = localStorage.getItem('kws_about_title') || 'The Developer Behind the Studio';
  document.getElementById('admin-bio1').value = localStorage.getItem('kws_bio1') || "I'm Kingsley, a self-taught web developer based in Nigeria with over 3 years of experience building modern digital products.";
  document.getElementById('admin-bio2').value = localStorage.getItem('kws_bio2') || "From simple landing pages to full-stack web applications, I bring ideas to life with clean code and pixel-perfect design.";

  // Contact
  document.getElementById('admin-whatsapp').value  = localStorage.getItem('kws_whatsapp')  || '2348024531430';
  document.getElementById('admin-location').value   = localStorage.getItem('kws_location')   || 'Nigeria 🇳🇬';
  document.getElementById('admin-response').value   = localStorage.getItem('kws_response')   || 'Within 24 hours';

  // Services
  renderServicesEditor();

  // Projects
  renderProjectsEditor();
}

/* ── ABOUT ── */
function saveAbout() {
  localStorage.setItem('kws_about_title', document.getElementById('admin-about-title').value);
  localStorage.setItem('kws_bio1',        document.getElementById('admin-bio1').value);
  localStorage.setItem('kws_bio2',        document.getElementById('admin-bio2').value);
  showToast('toast-about');
}

function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('photo-preview').src = e.target.result;
    localStorage.setItem('kws_photo', e.target.result);
  };
  reader.readAsDataURL(file);
}

/* ── SERVICES ── */
const defaultServices = [
  { icon:'🌐', name:'Basic Website',     price:'60000',  desc:'Perfect for individuals and small businesses.',     features:'Up to 5 pages\nResponsive design\nContact form\nSEO basics\nFast delivery' },
  { icon:'⚡', name:'Standard Website',   price:'100000', desc:'For businesses that need more pages and features.',  features:'Up to 10 pages\nPremium UI design\nAnimations\nBlog integration\nPriority support' },
  { icon:'🛒', name:'E-Commerce Store',   price:'150000', desc:'Full online store with cart and payments.',          features:'Product catalogue\nShopping cart\nPayment gateway\nOrder management\nAdmin dashboard' },
  { icon:'🔧', name:'Full Stack App',     price:'250000', desc:'Complete web app with database and backend.',        features:'Custom backend/API\nDatabase integration\nUser authentication\nAdmin dashboard\nFull documentation' },
];

function getServices() {
  try {
    const saved = localStorage.getItem('kws_services');
    return saved ? JSON.parse(saved) : defaultServices;
  } catch(e) { return defaultServices; }
}

function renderServicesEditor() {
  const services = getServices();
  const container = document.getElementById('services-editor');
  container.innerHTML = services.map((s, i) => `
    <div class="service-edit-card">
      <div class="service-edit-title">${s.icon} ${s.name}</div>
      <div class="price-row">
        <div class="form-group">
          <label class="form-label">Package Name</label>
          <input class="form-input" id="svc-name-${i}" value="${s.name}" />
        </div>
        <div class="form-group">
          <label class="form-label">Price (₦)</label>
          <input class="form-input" type="number" id="svc-price-${i}" value="${s.price}" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Short Description</label>
        <input class="form-input" id="svc-desc-${i}" value="${s.desc}" />
      </div>
      <div class="form-group">
        <label class="form-label">Features (one per line)</label>
        <textarea class="form-input form-textarea" id="svc-features-${i}" rows="5">${s.features}</textarea>
      </div>
    </div>
  `).join('');
}

function saveServices() {
  const services = getServices().map((s, i) => ({
    icon:     s.icon,
    name:     document.getElementById(`svc-name-${i}`).value,
    price:    document.getElementById(`svc-price-${i}`).value,
    desc:     document.getElementById(`svc-desc-${i}`).value,
    features: document.getElementById(`svc-features-${i}`).value,
  }));
  localStorage.setItem('kws_services', JSON.stringify(services));
  showToast('toast-services');
}

/* ── PROJECTS ── */
const defaultProjects = [
  { icon:'💰', name:'BIG EARN', tag:'Full Stack', desc:'A crypto investment platform built with Next.js 14 and Supabase.', live:'https://bigearn.vercel.app', github:'https://github.com/purecomic', color1:'#1e3a5f', color2:'#3B82F6' },
  { icon:'🏠', name:'Chukwujekwu Real Estate', tag:'Full Stack', desc:'A real estate listing platform for Nigeria.', live:'https://chukwujekwu-real-estate-nigeria-dev.vercel.app', github:'https://github.com/purecomic', color1:'#1a3a2a', color2:'#10B981' },
  { icon:'🎵', name:'Mainedit', tag:'E-Commerce', desc:'A sound effects marketplace for creators.', live:'https://mainedit.vercel.app', github:'https://github.com/purecomic', color1:'#2d1a3a', color2:'#8B5CF6' },
];

function getProjects() {
  try {
    const saved = localStorage.getItem('kws_projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  } catch(e) { return defaultProjects; }
}

function renderProjectsEditor() {
  const projects = getProjects();
  const container = document.getElementById('projects-editor');
  container.innerHTML = projects.map((p, i) => `
    <div class="project-edit-card" id="proj-card-${i}">
      <button class="project-delete-btn" onclick="deleteProject(${i})">✕ Remove</button>
      <div class="form-group">
        <label class="form-label">Project Name</label>
        <input class="form-input" id="proj-name-${i}" value="${p.name}" />
      </div>
      <div class="price-row">
        <div class="form-group">
          <label class="form-label">Tag / Type</label>
          <input class="form-input" id="proj-tag-${i}" value="${p.tag}" />
        </div>
        <div class="form-group">
          <label class="form-label">Icon (emoji)</label>
          <input class="form-input" id="proj-icon-${i}" value="${p.icon}" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input form-textarea" id="proj-desc-${i}" rows="3">${p.desc}</textarea>
      </div>
      <div class="price-row">
        <div class="form-group">
          <label class="form-label">Live URL</label>
          <input class="form-input" id="proj-live-${i}" value="${p.live||''}" placeholder="https://..." />
        </div>
        <div class="form-group">
          <label class="form-label">GitHub URL</label>
          <input class="form-input" id="proj-github-${i}" value="${p.github||''}" placeholder="https://github.com/..." />
        </div>
      </div>
    </div>
  `).join('');
}

function addProject() {
  const projects = getProjects();
  projects.push({ icon:'💻', name:'New Project', tag:'Web App', desc:'Project description here.', live:'', github:'', color1:'#1e293b', color2:'#3B82F6' });
  localStorage.setItem('kws_projects', JSON.stringify(projects));
  renderProjectsEditor();
}

function deleteProject(i) {
  if (!confirm('Remove this project?')) return;
  const projects = getProjects();
  projects.splice(i, 1);
  localStorage.setItem('kws_projects', JSON.stringify(projects));
  renderProjectsEditor();
}

function saveProjects() {
  const projects = getProjects().map((p, i) => ({
    icon:   document.getElementById(`proj-icon-${i}`).value,
    name:   document.getElementById(`proj-name-${i}`).value,
    tag:    document.getElementById(`proj-tag-${i}`).value,
    desc:   document.getElementById(`proj-desc-${i}`).value,
    live:   document.getElementById(`proj-live-${i}`).value,
    github: document.getElementById(`proj-github-${i}`).value,
    color1: p.color1 || '#1e293b',
    color2: p.color2 || '#3B82F6',
  }));
  localStorage.setItem('kws_projects', JSON.stringify(projects));
  showToast('toast-projects');
}

// Allow save from panel header button
document.querySelector('#tab-projects .panel-header .btn-primary')
  ?.addEventListener('click', () => saveProjects());

/* ── CONTACT ── */
function saveContact() {
  localStorage.setItem('kws_whatsapp', document.getElementById('admin-whatsapp').value);
  localStorage.setItem('kws_location',  document.getElementById('admin-location').value);
  localStorage.setItem('kws_response',  document.getElementById('admin-response').value);
  showToast('toast-contact');
}

/* ── Toast helper ── */
function showToast(id) {
  const toast = document.getElementById(id);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

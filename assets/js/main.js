const menu = document.getElementById('nav-menu');
const toggle = document.getElementById('nav-toggle');
const themeButton = document.getElementById('theme-button');

function setMenu(open) {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  const label = open ? 'Close navigation' : 'Open navigation';
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
  toggle.querySelector('i').className = open ? 'ri-close-line' : 'ri-menu-line';
}

toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    setMenu(false);
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.navigation')) setMenu(false);
});
window.matchMedia('(min-width: 681px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

function setTheme(dark) {
  document.body.classList.toggle('dark-theme', dark);
  themeButton.querySelector('i').className = dark ? 'ri-sun-line' : 'ri-moon-line';
  const label = `Switch to ${dark ? 'light' : 'dark'} theme`;
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
  document.querySelector('meta[name="theme-color"]').content = dark ? '#1c1f22' : '#f7f8fa';
}

try {
  setTheme(localStorage.getItem('selected-theme') === 'dark');
} catch {
  setTheme(false);
}
themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark-theme');
  setTheme(dark);
  try {
    localStorage.setItem('selected-theme', dark ? 'dark' : 'light');
  } catch { /* Local file previews may not permit persistent storage. */ }
});

document.querySelectorAll('[data-year]').forEach(element => {
  element.textContent = new Date().getFullYear();
});

const filters = document.querySelector('.project-filters');
const projects = document.querySelectorAll('.project');
filters.hidden = false;
filters.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    filters.querySelectorAll('button').forEach(filter => {
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    let visibleCount = 0;
    projects.forEach(project => {
      const visible = button.dataset.filter === 'all' || project.dataset.category === button.dataset.filter;
      project.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    document.getElementById('filter-status').textContent = `${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'} shown.`;
  });
});

const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
let copyReset;
if (navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    clearTimeout(copyReset);
    try {
      await navigator.clipboard.writeText('farhanasyraaf2002@gmail.com');
      copyStatus.textContent = 'Email address copied.';
      copyButton.querySelector('i').className = 'ri-check-line';
    } catch {
      copyStatus.textContent = 'Select the email address to copy it.';
    }
    copyReset = setTimeout(() => {
      copyStatus.textContent = '';
      copyButton.querySelector('i').className = 'ri-file-copy-line';
    }, 3500);
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      menu.querySelectorAll('a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-10% 0px -60% 0px' });
  document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
}

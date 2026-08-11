async function fetchProjects() {
  try {
    const res = await fetch('src/data/projects.json');
    if (!res.ok) throw new Error('Failed to load projects.json');
    const data = await res.json();
    return data.projects || [];
  } catch (err) {
    console.error('Error loading projects:', err);
    return [];
  }
}

function createProjectItem(project, index, total) {
  const div = document.createElement('div');
  div.className = `project-item ${index === 0 ? 'active' : ''}`;
  div.setAttribute('data-project', index);
  div.setAttribute('tabindex', '0');
  div.setAttribute('role', 'article');
  div.setAttribute('aria-label', `Project ${index + 1} of ${total}`);

  div.innerHTML = `
    <div class="project-header">
      <div class="project-meta">
        <span class="project-number">${project.number}</span>
        <span class="project-year">${project.year}</span>
        <span class="project-status ${project.status.toLowerCase()}">${project.status}</span>
      </div>
    </div>
    <div class="project-content">
      <h3 class="project-title">${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <div class="project-stack">
        ${project.stack.map(tech => `<span class="stack-item">${tech}</span>`).join('')}
      </div>
      <div class="project-links">
        <a href="${project.links.primary.url}" class="project-link" target="_blank">${project.links.primary.text}</a>
        <a href="${project.links.secondary.url}" class="project-link secondary" target="_blank">${project.links.secondary.text}</a>
      </div>
    </div>
  `;
  return div;
}

function createPreviewImage(project, index) {
  const div = document.createElement('div');
  div.className = `preview-image ${index === 0 ? 'active' : ''}`;
  div.setAttribute('data-project', index);

  const img = document.createElement('img');
  img.src = project.image.src;
  img.alt = project.image.alt;
  img.loading = "lazy";
  img.onload = () => img.classList.add('loaded');

  div.appendChild(img);
  return div;
}

function updateActiveProject(index, total) {
  const items = document.querySelectorAll('.project-item');
  const previews = document.querySelectorAll('.preview-image');

  items.forEach((el, i) => el.classList.toggle('active', i === index));
  previews.forEach((el, i) => el.classList.toggle('active', i === index));
}

function addProjectEventListeners(total) {
  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.project);
      updateActiveProject(index, total);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const index = parseInt(item.dataset.project);
        updateActiveProject(index, total);
      }
    });
  });
}

function addScrollSync(total) {
  const items = document.querySelectorAll('.project-item');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.project);
        updateActiveProject(index, total);
      }
    });
  }, observerOptions);

  items.forEach(item => observer.observe(item));
}

async function renderProjects() {
  const projects = await fetchProjects();
  const list = document.getElementById('project-list');
  const preview = document.getElementById('preview-container');

  if (!list || !preview) return;

  list.innerHTML = '';
  preview.innerHTML = '';

  projects.forEach((project, i) => {
    list.appendChild(createProjectItem(project, i, projects.length));
    preview.appendChild(createPreviewImage(project, i));
  });

  addProjectEventListeners(projects.length);
  addScrollSync(projects.length);
  updateActiveProject(0, projects.length);
}

document.addEventListener('DOMContentLoaded', renderProjects);

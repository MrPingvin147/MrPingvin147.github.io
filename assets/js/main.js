const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const smoothLinks = document.querySelectorAll('a[href^="#"]');

smoothLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navLinks?.classList.remove('open');
  });
});

const ageElement = document.querySelector('.age[data-birth-date]');

if (ageElement) {
  const birthDateArray = ageElement.dataset.birthDate.split('-')
  const birthDate = new Date(birthDateArray[2], birthDateArray[1] - 1, birthDateArray[0]);

  if (!Number.isNaN(birthDate.getTime())) {
    const currentDate = new Date()
    ageElement.textContent = String(Math.floor((currentDate - birthDate)/3.154e10));
  }
  else{
    ageElement.textContent = "00"
  }
}

async function loadCourses() {
  try {
    const response = await fetch('assets/data/courses.json');
    if (!response.ok) {
      throw new Error(`loading courses.json status: ${response.status}`);
    }
    const data = await response.json();
    
    const coursesGrid = document.getElementById('coursesGrid');
    const showMoreBtn = document.getElementById('showMoreCourses');
    
    if (!coursesGrid) return;
    
    let allExpanded = false;
    
    function renderCourses(showAll = false) {
      coursesGrid.innerHTML = '';
      
      data.courses.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        
        if (!course.visible && !showAll) {
          courseCard.classList.add('course-hidden');
        }
        
        courseCard.innerHTML = `
          <h3 class="course-title">${course.title}</h3>
          <p class="course-desc">${course.description}</p>
        `;
        
        coursesGrid.appendChild(courseCard);
      });
    }
    
    renderCourses();
    
    const hasHiddenCourses = data.courses.some(c => !c.visible);
    if (hasHiddenCourses && showMoreBtn) {
      showMoreBtn.style.display = 'block';
      
      showMoreBtn.addEventListener('click', () => {
        allExpanded = !allExpanded;
        renderCourses(allExpanded);
        
        const showText = showMoreBtn.querySelector('.show-text');
        const hideText = showMoreBtn.querySelector('.hide-text');
        
        showText.style.display = allExpanded ? 'none' : 'inline';
        hideText.style.display = allExpanded ? 'inline' : 'none';
      });
    }
    
  } catch (error) {
    console.error('Failed to load courses:', error);
  }
}

async function loadProgrammingLanguages() {
  try {
    const response = await fetch('assets/data/programming_languages.json');
    if (!response.ok) {
      throw new Error(`loading programming_languages.json status: ${response.status}`);
    }
    const data = await response.json();
    
    const codingSkillsContainer = document.getElementById('codingSkills');
    if (!codingSkillsContainer) return;
    
    data.programmingLanguages.forEach(skill => {
      const skillItem = document.createElement('div');
      skillItem.className = 'skill-item';
      
      skillItem.innerHTML = `
        <div class="skill-header">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-level">${skill.level}</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" style="width: ${skill.progress}%"></div>
        </div>
      `;
      
      codingSkillsContainer.appendChild(skillItem);
    });
    
  } catch (error) {
    console.error('Failed to load skills:', error);
    console.error('Error details:', error.message);
  }
}

async function loadTools() {
  try {
    const response = await fetch('assets/data/tools.json');
    if (!response.ok) {
      throw new Error(`loading tools.json status: ${response.status}`);
    }
    const data = await response.json();
    
    const toolsSkillsContainer = document.getElementById('toolsSkills');
    if (!toolsSkillsContainer) return;
    
    data.tools.forEach(tool => {
      const toolSpan = document.createElement('span');
      toolSpan.textContent = tool;
      toolsSkillsContainer.appendChild(toolSpan);
    });
    
  } catch (error) {
    console.error('Failed to load tools: ', error);
    console.error('Error details: ', error.message);
  }
}

async function loadProjects() {
  const projectsGrid = document.querySelector('#projects .card-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = '';

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    if (typeof dateValue === 'string' && dateValue.includes('-')) {
      const [day, month, year] = dateValue.split('-').map(Number);
      if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
        const parsed = new Date(year, month - 1, day);
        if (!Number.isNaN(parsed.getTime())) {
          return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
      }
    }

    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    return '';
  };

  const renderCard = (options) => {
    const card = document.createElement('article');
    card.className = 'card';

    const languageBadge = options.language
      ? `<span class="repo-language">${options.language}</span>`
      : '';

    const dateLabel = options.updatedAt ? formatDate(options.updatedAt) : '';
    const statsMarkup = options.stats?.length
      ? options.stats.map((stat) => `<span class="stat">${stat}</span>`).join('')
      : '';

    card.innerHTML = `
      <div class="card-header">
        <h3>${options.title}</h3>
        ${languageBadge}
      </div>
      <p>${options.description || 'No description available'}</p>
      <div class="card-footer">
        <div class="repo-stats">
          ${statsMarkup}
          ${dateLabel ? `<span class="stat">Updated ${dateLabel}</span>` : ''}
        </div>
        ${options.linkUrl ? `<a href="${options.linkUrl}" target="_blank" class="card-link">${options.linkLabel} →</a>` : ''}
      </div>
    `;

    projectsGrid.appendChild(card);
  };

  try {
    const response = await fetch('assets/data/projects.json');

    if (!response.ok) {
      throw new Error(`loading projects.json status: ${response.status}`);
    }

    const data = await response.json();

    data.projects.forEach((project) => {
      renderCard({
        title: project.name,
        language: project.language,
        description: project.description,
        updatedAt: project.date,
        linkUrl: project.url,
        linkLabel: 'View project'
      });
    });
  } catch (error) {
    console.error('Failed to load projects:', error);
    console.error('Error details: ', error.message);
  }

  try {
    const username = 'MrPingvin147'; // Your GitHub username
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const repos = await response.json();

    const filteredRepos = repos
      .filter((repo) => !repo.fork && repo.name !== 'MrPingvin147.github.io')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    filteredRepos.slice(0, 6).forEach((repo) => {
      const stats = [];
      if (repo.stargazers_count > 0) stats.push(`⭐ ${repo.stargazers_count}`);
      if (repo.forks_count > 0) stats.push(`🔱 ${repo.forks_count}`);

      renderCard({
        title: repo.name,
        language: repo.language,
        description: repo.description,
        updatedAt: repo.updated_at,
        linkUrl: repo.html_url,
        linkLabel: 'View on GitHub',
        stats
      });
    });
  } catch (error) {
    console.error('Failed to load GitHub projects:', error);
  }
}

loadProgrammingLanguages();
loadTools();
loadCourses();
loadProjects();

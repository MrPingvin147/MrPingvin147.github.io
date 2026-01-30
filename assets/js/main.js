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

// Load and render courses from JSON
async function loadCourses() {
  try {
    const response = await fetch('assets/data/courses.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

// Load and render programming skills from JSON
async function loadSkills() {
  try {
    const response = await fetch('assets/data/skills.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

// Load and render tools from JSON
async function loadTools() {
  try {
    const response = await fetch('assets/data/tools.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    console.error('Failed to load tools:', error);
    console.error('Error details:', error.message);
  }
}

loadSkills();
loadTools();
loadCourses();

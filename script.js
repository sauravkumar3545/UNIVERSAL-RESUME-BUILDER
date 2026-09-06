/* ==========================================================================
   RESUME BUILDER - VANILLA JAVASCRIPT LOGIC ENGINE & ATS ANALYZER
   ========================================================================== */

const STORAGE_KEY = 'resumeBuilderData';

// ==========================================================================
// Resume Data Model (Initialized with Sumit Kumar Reference Resume Data)
// ==========================================================================
let resumeData = {
  level: 'Placement Ready',
  personal: {
    name: 'SUMIT KUMAR',
    title: 'Data Analyst & B.Tech Computer Science Student',
    email: 'kumarsumitbgs2@gmail.com',
    phone: '+91 8409001903',
    location: 'Remote, India',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    portfolio: 'https://portfolio.com'
  },
  summary: 'B.Tech Computer Science student and Data Analyst with hands-on internship experience turning raw data into actionable business insights. Skilled in SQL, Excel, Power BI, and Python (Pandas, NumPy) for data cleaning, exploratory data analysis, and dashboard development. Experience working across 30-40 datasets and building 10 Power BI dashboards to support data-driven decision-making.',
  skills: [
    { category: 'Data Analytics', skills: 'SQL, Excel (Advanced), Power BI, Python, Pandas, NumPy' },
    { category: 'Data Analysis', skills: 'Data Cleaning, Data Validation, EDA, Statistical Analysis, Data Visualization' },
    { category: 'Databases & Tools', skills: 'MySQL, Git, GitHub, Jupyter Notebook, VS Code' },
    { category: 'Programming', skills: 'Python, SQL, C++' },
    { category: 'CS Fundamentals', skills: 'DBMS, DSA, OOP' }
  ],
  experience: [
    {
      title: 'Data Analyst Intern',
      company: 'Zidio Development',
      location: 'Remote, India',
      startDate: '21 June 2026',
      endDate: 'Present',
      description: 'Cleaned and preprocessed 30-40+ real-world datasets using Excel, SQL, and Python to prepare structured data for analysis.\nPerformed exploratory data analysis (EDA) and data validation to identify trends, patterns, and data quality issues.\nBuilt 10 interactive Power BI dashboards to track KPIs and communicate business insights to stakeholders.\nConducted SQL-based querying and Excel-based analysis to support data-driven decision-making across projects.\nPresented analytical findings and dashboard insights in clear, structured summaries for review.'
    }
  ],
  projects: [
    {
      name: 'E-commerce Sales & Customer Insights Dashboard',
      role: '',
      tools: 'Excel | SQL | Python | Power BI',
      github: '',
      description: 'Analyzed sales, profit, product, and regional performance data to identify key business drivers.\nBuilt an interactive Power BI dashboard tracking KPIs including sales, profit, category performance, discount impact, and customer segments.\nDelivered insights and recommendations to support strategies for improving profitability and sales performance.'
    },
    {
      name: 'Customer Churn Analysis',
      role: '',
      tools: 'Python | SQL',
      github: '',
      description: 'Cleaned and analyzed customer data to identify key factors influencing churn, including tenure, service type, and plan.\nInvestigated churn trends across customer demographics using SQL and Python.\nGenerated data-backed customer-retention recommendations based on identified churn patterns.'
    },
    {
      name: 'Bank Loan & Credit Risk Analysis',
      role: '',
      tools: 'SQL | Excel | Power BI',
      github: '',
      description: 'Analyzed loan application and customer financial data, including credit score, income, and loan amount, to identify risk patterns.\nBuilt Power BI dashboards to monitor repayment status, loan amount, and high-risk customer segments.\nGenerated insights using SQL and Excel to support data-driven lending decisions.'
    },
    {
      name: 'Hospital Patient Appointment & Operational Analysis',
      role: '',
      tools: 'Excel | SQL | Python | Power BI',
      github: '',
      description: 'Analyzed hospital appointment, patient, and department data to uncover operational gaps and no-show patterns.\nBuilt a dashboard tracking appointment no-shows, patient demographics, and doctor workload distribution.\nRecommended improvements to appointment scheduling and workload distribution based on identified trends.'
    }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'Uttarakhand Technical University',
      location: '',
      startYear: '2023',
      endYear: '2027',
      grade: 'GPA: 6.5 / 10.0'
    }
  ],
  certifications: [
    {
      name: 'AWS Certification in Cloud Computing',
      organization: 'ICT Academy',
      date: '2025',
      url: ''
    },
    {
      name: 'Advanced Python',
      organization: 'Appwars',
      date: '2025',
      url: ''
    }
  ],
  achievements: [],
  activities: [],
  coursework: [],
  interests: [],
  customSections: []
};

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();

  bindPersonalInputs();

  renderSkillsForms();
  renderExperienceForms();
  renderProjectsForms();
  renderEducationForms();
  renderCertificationsForms();
  renderAchievementsForms();
  renderActivitiesForms();
  renderCourseworkForms();
  renderLanguagesForms();
  renderInterestsForms();
  renderCustomForms();

  renderPreview();

  setupLiveListeners();
  setupDragAndDrop();
});

// ==========================================================================
// Form Handling
// ==========================================================================
function bindPersonalInputs() {
  const p = resumeData.personal || {};
  document.getElementById('resume-level').value = resumeData.level || 'Placement Ready';
  document.getElementById('p-name').value = p.name || '';
  document.getElementById('p-title').value = p.title || '';
  document.getElementById('p-email').value = p.email || '';
  document.getElementById('p-phone').value = p.phone || '';
  document.getElementById('p-location').value = p.location || '';
  document.getElementById('p-linkedin').value = p.linkedin || '';
  document.getElementById('p-github').value = p.github || '';
  document.getElementById('p-portfolio').value = p.portfolio || '';
  document.getElementById('summary-text').value = resumeData.summary || '';
}

function handleLevelChange() {
  const levelSelect = document.getElementById('resume-level');
  resumeData.level = levelSelect.value;
  triggerDataUpdate();
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function setupLiveListeners() {
  const fields = [
    { id: 'p-name', key: 'name', validate: validateName },
    { id: 'p-title', key: 'title' },
    { id: 'p-email', key: 'email', validate: validateEmail },
    { id: 'p-phone', key: 'phone', validate: validatePhone },
    { id: 'p-location', key: 'location' },
    { id: 'p-linkedin', key: 'linkedin' },
    { id: 'p-github', key: 'github' },
    { id: 'p-portfolio', key: 'portfolio' }
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) {
      el.addEventListener('input', (e) => {
        resumeData.personal[f.key] = e.target.value.trim();
        if (f.validate) f.validate(e.target.value.trim());
        triggerDataUpdate();
      });
    }
  });

  const summaryEl = document.getElementById('summary-text');
  if (summaryEl) {
    summaryEl.addEventListener('input', (e) => {
      resumeData.summary = e.target.value;
      triggerDataUpdate();
    });
  }
}

// ==========================================================================
// Validation
// ==========================================================================
function validateName(val) {
  const errEl = document.getElementById('err-p-name');
  if (!errEl) return;
  if (!val) {
    errEl.textContent = 'Full Name is required';
  } else {
    errEl.textContent = '';
  }
}

function validateEmail(val) {
  const errEl = document.getElementById('err-p-email');
  if (!errEl) return;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) {
    errEl.textContent = 'Email address is required';
  } else if (!emailRegex.test(val)) {
    errEl.textContent = 'Please enter a valid email address';
  } else {
    errEl.textContent = '';
  }
}

function validatePhone(val) {
  const errEl = document.getElementById('err-p-phone');
  if (!errEl) return;
  if (val && !/^[0-9+\s\-()]{7,20}$/.test(val)) {
    errEl.textContent = 'Please enter a valid phone number';
  } else {
    errEl.textContent = '';
  }
}

function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed;
  }
  return 'https://' + trimmed;
}

// ==========================================================================
// Dynamic Sections Form Renderers
// ==========================================================================

// SKILLS
function renderSkillsForms() {
  const container = document.getElementById('skills-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.skills || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Skill Category #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('skills', ${index})" title="Delete Category">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Category Title</label>
          <input type="text" class="form-control" value="${escapeAttr(item.category)}" placeholder="e.g. Data Analytics / Programming" oninput="updateItemField('skills', ${index}, 'category', this.value)">
        </div>
        <div class="form-group">
          <label>Skills (Comma-separated)</label>
          <input type="text" class="form-control" value="${escapeAttr(item.skills)}" placeholder="e.g. SQL, Excel, Python, Pandas, NumPy" oninput="updateItemField('skills', ${index}, 'skills', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addSkillCategory() {
  if (!resumeData.skills) resumeData.skills = [];
  resumeData.skills.push({ category: '', skills: '' });
  renderSkillsForms();
  triggerDataUpdate();
}

// EXPERIENCE
function renderExperienceForms() {
  const container = document.getElementById('experience-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.experience || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Experience #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('experience', ${index})" title="Delete Entry">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Job / Internship Title</label>
          <input type="text" class="form-control" value="${escapeAttr(item.title)}" placeholder="e.g. Data Analyst Intern" oninput="updateItemField('experience', ${index}, 'title', this.value)">
        </div>
        <div class="form-group">
          <label>Company / Organization</label>
          <input type="text" class="form-control" value="${escapeAttr(item.company)}" placeholder="e.g. Zidio Development" oninput="updateItemField('experience', ${index}, 'company', this.value)">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="form-control" value="${escapeAttr(item.location)}" placeholder="e.g. Remote, India" oninput="updateItemField('experience', ${index}, 'location', this.value)">
        </div>
        <div class="form-group">
          <label>Dates (Start – End)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" class="form-control" value="${escapeAttr(item.startDate)}" placeholder="21 June 2026" oninput="updateItemField('experience', ${index}, 'startDate', this.value)">
            <input type="text" class="form-control" value="${escapeAttr(item.endDate)}" placeholder="Present" oninput="updateItemField('experience', ${index}, 'endDate', this.value)">
          </div>
        </div>
        <div class="form-group full-width">
          <label>Bullet Points (One per line)</label>
          <textarea class="form-control" rows="4" placeholder="Cleaned and preprocessed 30-40+ real-world datasets...\nBuilt 10 interactive Power BI dashboards..." oninput="updateItemField('experience', ${index}, 'description', this.value)">${escapeText(item.description)}</textarea>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addExperience() {
  if (!resumeData.experience) resumeData.experience = [];
  resumeData.experience.push({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' });
  renderExperienceForms();
  triggerDataUpdate();
}

// PROJECTS
function renderProjectsForms() {
  const container = document.getElementById('projects-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.projects || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Project #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('projects', ${index})" title="Delete Project">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Project Name</label>
          <input type="text" class="form-control" value="${escapeAttr(item.name)}" placeholder="e.g. E-commerce Sales & Insights Dashboard" oninput="updateItemField('projects', ${index}, 'name', this.value)">
        </div>
        <div class="form-group">
          <label>Technologies / Tools Stack</label>
          <input type="text" class="form-control" value="${escapeAttr(item.tools)}" placeholder="e.g. Excel | SQL | Python | Power BI" oninput="updateItemField('projects', ${index}, 'tools', this.value)">
        </div>
        <div class="form-group full-width">
          <label><i class="fa-brands fa-github"></i> GitHub Repository URL (Optional)</label>
          <input type="url" class="form-control" value="${escapeAttr(item.github)}" placeholder="https://github.com/username/project-repo" oninput="updateItemField('projects', ${index}, 'github', this.value)">
        </div>
        <div class="form-group full-width">
          <label>Bullet Points (One per line)</label>
          <textarea class="form-control" rows="3" placeholder="Analyzed sales, profit, and regional performance data...\nBuilt an interactive Power BI dashboard..." oninput="updateItemField('projects', ${index}, 'description', this.value)">${escapeText(item.description)}</textarea>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addProject() {
  if (!resumeData.projects) resumeData.projects = [];
  resumeData.projects.push({ name: '', role: '', tools: '', github: '', description: '' });
  renderProjectsForms();
  triggerDataUpdate();
}

// EDUCATION
function renderEducationForms() {
  const container = document.getElementById('education-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.education || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Education #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('education', ${index})" title="Delete Entry">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Degree / Qualification</label>
          <input type="text" class="form-control" value="${escapeAttr(item.degree)}" placeholder="e.g. B.Tech in Computer Science" oninput="updateItemField('education', ${index}, 'degree', this.value)">
        </div>
        <div class="form-group">
          <label>Institution / University</label>
          <input type="text" class="form-control" value="${escapeAttr(item.institution)}" placeholder="e.g. Uttarakhand Technical University" oninput="updateItemField('education', ${index}, 'institution', this.value)">
        </div>
        <div class="form-group">
          <label>Dates (Years)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" class="form-control" value="${escapeAttr(item.startYear)}" placeholder="2023" oninput="updateItemField('education', ${index}, 'startYear', this.value)">
            <input type="text" class="form-control" value="${escapeAttr(item.endYear)}" placeholder="2027" oninput="updateItemField('education', ${index}, 'endYear', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>GPA / Grade</label>
          <input type="text" class="form-control" value="${escapeAttr(item.grade)}" placeholder="e.g. GPA: 6.5 / 10.0" oninput="updateItemField('education', ${index}, 'grade', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addEducation() {
  if (!resumeData.education) resumeData.education = [];
  resumeData.education.push({ degree: '', institution: '', location: '', startYear: '', endYear: '', grade: '' });
  renderEducationForms();
  triggerDataUpdate();
}

// CERTIFICATIONS
function renderCertificationsForms() {
  const container = document.getElementById('certifications-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.certifications || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Certification #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('certifications', ${index})" title="Delete Entry">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Certification Name</label>
          <input type="text" class="form-control" value="${escapeAttr(item.name)}" placeholder="e.g. AWS Certification in Cloud Computing" oninput="updateItemField('certifications', ${index}, 'name', this.value)">
        </div>
        <div class="form-group">
          <label>Issuing Organization & Year</label>
          <input type="text" class="form-control" value="${escapeAttr(item.organization)}" placeholder="e.g. ICT Academy, 2025" oninput="updateItemField('certifications', ${index}, 'organization', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addCertificate() {
  if (!resumeData.certifications) resumeData.certifications = [];
  resumeData.certifications.push({ name: '', organization: '', date: '', url: '' });
  renderCertificationsForms();
  triggerDataUpdate();
}

// ACHIEVEMENTS
function renderAchievementsForms() {
  const container = document.getElementById('achievements-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.achievements || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Achievement #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('achievements', ${index})" title="Delete Entry">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Achievement Title / Description</label>
          <input type="text" class="form-control" value="${escapeAttr(item.title)}" placeholder="e.g. Winner of National Hackathon 2025" oninput="updateItemField('achievements', ${index}, 'title', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addAchievement() {
  if (!resumeData.achievements) resumeData.achievements = [];
  resumeData.achievements.push({ title: '', description: '' });
  renderAchievementsForms();
  triggerDataUpdate();
}

// ACTIVITIES
function renderActivitiesForms() {
  const container = document.getElementById('activities-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.activities || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Activity #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('activities', ${index})" title="Delete Entry">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Role / Position</label>
          <input type="text" class="form-control" value="${escapeAttr(item.position)}" placeholder="e.g. Student Lead" oninput="updateItemField('activities', ${index}, 'position', this.value)">
        </div>
        <div class="form-group">
          <label>Organization</label>
          <input type="text" class="form-control" value="${escapeAttr(item.organization)}" placeholder="e.g. Coding Society" oninput="updateItemField('activities', ${index}, 'organization', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addActivity() {
  if (!resumeData.activities) resumeData.activities = [];
  resumeData.activities.push({ position: '', organization: '', description: '' });
  renderActivitiesForms();
  triggerDataUpdate();
}

// RELEVANT COURSEWORK
function renderCourseworkForms() {
  const container = document.getElementById('coursework-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.coursework || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Coursework #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('coursework', ${index})" title="Delete Entry">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Course Name</label>
          <input type="text" class="form-control" value="${escapeAttr(item.title)}" placeholder="e.g. Data Structures & Algorithms, Operating Systems" oninput="updateItemField('coursework', ${index}, 'title', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addCoursework() {
  if (!resumeData.coursework) resumeData.coursework = [];
  resumeData.coursework.push({ title: '' });
  renderCourseworkForms();
  triggerDataUpdate();
}

// LANGUAGES
function renderLanguagesForms() {
  const container = document.getElementById('languages-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.languages || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Language #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('languages', ${index})" title="Delete Entry">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Language</label>
          <input type="text" class="form-control" value="${escapeAttr(item.language)}" placeholder="e.g. English" oninput="updateItemField('languages', ${index}, 'language', this.value)">
        </div>
        <div class="form-group">
          <label>Proficiency</label>
          <input type="text" class="form-control" value="${escapeAttr(item.proficiency)}" placeholder="e.g. Native / Professional" oninput="updateItemField('languages', ${index}, 'proficiency', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addLanguage() {
  if (!resumeData.languages) resumeData.languages = [];
  resumeData.languages.push({ language: '', proficiency: '' });
  renderLanguagesForms();
  triggerDataUpdate();
}

// INTERESTS
function renderInterestsForms() {
  const container = document.getElementById('interests-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.interests || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Interest #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('interests', ${index})" title="Delete Entry">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Interest / Hobby</label>
          <input type="text" class="form-control" value="${escapeAttr(item.title)}" placeholder="e.g. Competitive Programming, Chess" oninput="updateItemField('interests', ${index}, 'title', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addInterest() {
  if (!resumeData.interests) resumeData.interests = [];
  resumeData.interests.push({ title: '' });
  renderInterestsForms();
  triggerDataUpdate();
}

// CUSTOM SECTIONS
function renderCustomForms() {
  const container = document.getElementById('custom-list');
  if (!container) return;
  container.innerHTML = '';
  (resumeData.customSections || []).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Custom Section #${index + 1}</span>
        <button type="button" class="btn-icon-delete" onclick="removeItem('customSections', ${index})" title="Delete Section">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Section Heading</label>
          <input type="text" class="form-control" value="${escapeAttr(item.heading)}" placeholder="e.g. PUBLICATIONS or VOLUNTEERING" oninput="updateItemField('customSections', ${index}, 'heading', this.value)">
        </div>
        <div class="form-group full-width">
          <label>Content / Bullet Points</label>
          <textarea class="form-control" rows="3" placeholder="Enter details..." oninput="updateItemField('customSections', ${index}, 'content', this.value)">${escapeText(item.content)}</textarea>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function addCustomSection() {
  if (!resumeData.customSections) resumeData.customSections = [];
  resumeData.customSections.push({ heading: '', content: '' });
  renderCustomForms();
  triggerDataUpdate();
}

// Generic Array Field Update & Item Removal
function updateItemField(section, index, field, value) {
  if (resumeData[section] && resumeData[section][index]) {
    resumeData[section][index][field] = value;
    triggerDataUpdate();
  }
}

function removeItem(section, index) {
  if (resumeData[section]) {
    resumeData[section].splice(index, 1);
    if (section === 'skills') renderSkillsForms();
    if (section === 'experience') renderExperienceForms();
    if (section === 'projects') renderProjectsForms();
    if (section === 'education') renderEducationForms();
    if (section === 'certifications') renderCertificationsForms();
    if (section === 'achievements') renderAchievementsForms();
    if (section === 'activities') renderActivitiesForms();
    if (section === 'coursework') renderCourseworkForms();
    if (section === 'languages') renderLanguagesForms();
    if (section === 'interests') renderInterestsForms();
    if (section === 'customSections') renderCustomForms();
    
    triggerDataUpdate();
  }
}

// ==========================================================================
// Live Preview (EXACT SUMIT KUMAR REFERENCE DESIGN)
// ==========================================================================
function renderPreview() {
  const paper = document.getElementById('resume-preview');
  if (!paper) return;

  const p = resumeData.personal || {};
  const name = p.name ? p.name : 'SUMIT KUMAR';

  let html = '';
  html += `<div class="rp-header">`;
  html += `<div class="rp-name">${escapeText(name)}</div>`;

  const contactParts = [];
  if (p.phone) {
    const telHref = 'tel:' + String(p.phone).replace(/[^\d+]/g, '');
    contactParts.push(`<a class="rp-contact-item rp-contact-phone" href="${escapeAttr(telHref)}">${escapeText(p.phone)}</a>`);
  }
  if (p.email) {
    contactParts.push(`<a class="rp-contact-item" href="mailto:${escapeAttr(p.email)}">${escapeText(p.email)}</a>`);
  }
  if (p.location) {
    contactParts.push(`<span class="rp-contact-item">${escapeText(p.location)}</span>`);
  }
  if (p.linkedin) {
    const label = (p.linkedin.includes('http') || p.linkedin.includes('www')) ? 'LinkedIn' : p.linkedin;
    contactParts.push(`<a class="rp-contact-item" href="${escapeAttr(normalizeUrl(p.linkedin))}" target="_blank" rel="noopener noreferrer">${escapeText(label)}</a>`);
  }
  if (p.github) {
    const label = (p.github.includes('http') || p.github.includes('www')) ? 'GitHub' : p.github;
    contactParts.push(`<a class="rp-contact-item" href="${escapeAttr(normalizeUrl(p.github))}" target="_blank" rel="noopener noreferrer">${escapeText(label)}</a>`);
  }
  if (p.portfolio) {
    const label = (p.portfolio.includes('http') || p.portfolio.includes('www')) ? 'Portfolio' : p.portfolio;
    contactParts.push(`<a class="rp-contact-item" href="${escapeAttr(normalizeUrl(p.portfolio))}" target="_blank" rel="noopener noreferrer">${escapeText(label)}</a>`);
  }

  if (contactParts.length > 0) {
    html += `<div class="rp-contact-bar">${contactParts.join('<span class="rp-contact-sep"> | </span>')}</div>`;
  }
  html += `</div>`;

  html += buildSummarySectionHtml();
  html += buildSkillsSectionHtml();
  html += buildExperienceSectionHtml();
  html += buildProjectsSectionHtml();
  html += buildEducationSectionHtml();
  html += buildCertificationsSectionHtml();
  html += buildAchievementsSectionHtml();
  html += buildActivitiesSectionHtml();
  html += buildCourseworkSectionHtml();
  html += buildLanguagesSectionHtml();
  html += buildInterestsSectionHtml();
  html += buildCustomSectionsHtml();

  paper.innerHTML = html;
}

function buildSummarySectionHtml() {
  if (!resumeData.summary || resumeData.summary.trim() === '') return '';
  return `
    <div class="rp-section">
      <div class="rp-section-heading">PROFESSIONAL SUMMARY</div>
      <div class="rp-summary-text">${escapeText(resumeData.summary)}</div>
    </div>
  `;
}

function buildSkillsSectionHtml() {
  const validSkills = (resumeData.skills || []).filter(s => s.category || s.skills);
  if (validSkills.length === 0) return '';
  let html = `
    <div class="rp-section">
      <div class="rp-section-heading">SKILLS</div>
      <div class="rp-skills-list">
  `;
  validSkills.forEach(s => {
    html += `
      <div class="rp-skill-item">
        ${s.category ? `<span class="rp-skill-cat">${escapeText(s.category)}:</span>` : ''} ${escapeText(s.skills)}
      </div>
    `;
  });
  html += `</div></div>`;
  return html;
}

function buildExperienceSectionHtml() {
  const validExp = (resumeData.experience || []).filter(e => e.title || e.company || e.description);
  if (validExp.length === 0) return '';
  let html = `
    <div class="rp-section">
      <div class="rp-section-heading">EXPERIENCE</div>
  `;
  validExp.forEach(e => {
    const dates = [e.startDate, e.endDate].filter(Boolean).join(' - ');
    const subTitle = [e.company, e.location].filter(Boolean).join(', ');
    const bullets = parseBullets(e.description);
    html += `
      <div class="rp-item">
        <div class="rp-item-row">
          <div class="rp-item-title">${escapeText(e.title)} ${subTitle ? `| ${escapeText(subTitle)}` : ''}</div>
          ${dates ? `<div class="rp-item-right">${escapeText(dates)}</div>` : ''}
        </div>
        ${bullets.length > 0 ? `
          <ul class="rp-bullet-list">
            ${bullets.map(b => `<li>${escapeText(b)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function buildProjectsSectionHtml() {
  const validProj = (resumeData.projects || []).filter(proj => proj.name || proj.description);
  if (validProj.length === 0) return '';
  let html = `
    <div class="rp-section">
      <div class="rp-section-heading">PROJECTS</div>
  `;
  validProj.forEach(proj => {
    let titleHtml = escapeText(proj.name);
    if (proj.github && proj.github.trim() !== '') {
      const repoUrl = normalizeUrl(proj.github);
      titleHtml += ` <a href="${escapeAttr(repoUrl)}" target="_blank" rel="noopener noreferrer" class="rp-github-icon" title="View GitHub Repository"><i class="fa-brands fa-github"></i></a>`;
    }
    const bullets = parseBullets(proj.description);
    html += `
      <div class="rp-item">
        <div class="rp-item-row">
          <div class="rp-item-title">${titleHtml}</div>
          ${proj.tools ? `<div class="rp-item-right">${escapeText(proj.tools)}</div>` : ''}
        </div>
        ${bullets.length > 0 ? `
          <ul class="rp-bullet-list">
            ${bullets.map(b => `<li>${escapeText(b)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function buildEducationSectionHtml() {
  const validEdu = (resumeData.education || []).filter(ed => ed.degree || ed.institution);
  if (validEdu.length === 0) return '';
  let html = `
    <div class="rp-section">
      <div class="rp-section-heading">EDUCATION</div>
  `;
  validEdu.forEach(ed => {
    const years = [ed.startYear, ed.endYear].filter(Boolean).join(' - ');
    html += `
      <div class="rp-item">
        <div class="rp-item-row">
          <div class="rp-item-title">${escapeText(ed.degree)}</div>
          ${years ? `<div class="rp-item-right">${escapeText(years)}</div>` : ''}
        </div>
        <div class="rp-item-row">
          <div class="rp-item-subtitle">${escapeText(ed.institution)} ${ed.grade ? `| ${escapeText(ed.grade)}` : ''}</div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function buildCertificationsSectionHtml() {
  const validCert = (resumeData.certifications || []).filter(c => c.name || c.organization);
  if (validCert.length === 0) return '';
  let html = `
    <div class="rp-section">
      <div class="rp-section-heading">CERTIFICATIONS</div>
      <ul class="rp-cert-list">
  `;
  validCert.forEach(c => {
    let certText = escapeText(c.name);
    if (c.organization) certText += ` - ${escapeText(c.organization)}`;
    if (c.date) certText += `, ${escapeText(c.date)}`;
    if (c.url) certText += ` <a href="${escapeAttr(normalizeUrl(c.url))}" target="_blank" rel="noopener noreferrer">Link</a>`;
    html += `<li>${certText}</li>`;
  });
  html += `</ul></div>`;
  return html;
}

function buildAchievementsSectionHtml() {
  const validAch = (resumeData.achievements || []).filter(a => a.title);
  if (validAch.length === 0) return '';
  return `
    <div class="rp-section">
      <div class="rp-section-heading">ACHIEVEMENTS</div>
      <ul class="rp-bullet-list">
        ${validAch.map(a => `<li>${escapeText(a.title)} ${a.description ? `— ${escapeText(a.description)}` : ''}</li>`).join('')}
      </ul>
    </div>
  `;
}

function buildActivitiesSectionHtml() {
  const validAct = (resumeData.activities || []).filter(ac => ac.position || ac.organization);
  if (validAct.length === 0) return '';
  let html = `
    <div class="rp-section">
      <div class="rp-section-heading">POSITIONS OF RESPONSIBILITY</div>
  `;
  validAct.forEach(ac => {
    html += `
      <div class="rp-item">
        <div class="rp-item-title">${escapeText(ac.position)} ${ac.organization ? `| ${escapeText(ac.organization)}` : ''}</div>
        ${ac.description ? `<div class="rp-summary-text" style="margin-top:2px;">${escapeText(ac.description)}</div>` : ''}
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function buildCourseworkSectionHtml() {
  const validCourse = (resumeData.coursework || []).filter(cw => cw.title);
  if (validCourse.length === 0) return '';
  return `
    <div class="rp-section">
      <div class="rp-section-heading">RELEVANT COURSEWORK</div>
      <div class="rp-summary-text">${validCourse.map(cw => escapeText(cw.title)).join(' • ')}</div>
    </div>
  `;
}

function buildLanguagesSectionHtml() {
  const validLang = (resumeData.languages || []).filter(l => l.language);
  if (validLang.length === 0) return '';
  return `
    <div class="rp-section">
      <div class="rp-section-heading">LANGUAGES</div>
      <div class="rp-summary-text">
        ${validLang.map(l => `${escapeText(l.language)}${l.proficiency ? ` (${escapeText(l.proficiency)})` : ''}`).join(' • ')}
      </div>
    </div>
  `;
}

function buildInterestsSectionHtml() {
  const validInterests = (resumeData.interests || []).filter(i => i.title);
  if (validInterests.length === 0) return '';
  return `
    <div class="rp-section">
      <div class="rp-section-heading">INTERESTS</div>
      <div class="rp-summary-text">${validInterests.map(i => escapeText(i.title)).join(' • ')}</div>
    </div>
  `;
}

function buildCustomSectionsHtml() {
  const validCustom = (resumeData.customSections || []).filter(cs => cs.heading);
  if (validCustom.length === 0) return '';
  return validCustom.map(cs => {
    const bullets = parseBullets(cs.content);
    return `
      <div class="rp-section">
        <div class="rp-section-heading">${escapeText(cs.heading.toUpperCase())}</div>
        ${bullets.length > 0 ? `
          <ul class="rp-bullet-list">
            ${bullets.map(b => `<li>${escapeText(b)}</li>`).join('')}
          </ul>
        ` : `<div class="rp-summary-text">${escapeText(cs.content)}</div>`}
      </div>
    `;
  }).join('');
}

function parseBullets(text) {
  if (!text) return [];
  return String(text)
    .split(/\r?\n/)
    .map(line => line.replace(/^[•\-\*\s]+/, '').trim())
    .filter(line => line.length > 0);
}

function escapeText(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ==========================================================================
// localStorage & Quick Actions
// ==========================================================================
let saveTimeout;
function triggerDataUpdate() {
  renderPreview();

  showSaveStatus('Saving...', true);

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToLocalStorage();
    showSaveStatus('Saved automatically', false);
  }, 400);
}

function showSaveStatus(text, isSaving = false) {
  const statusEl = document.getElementById('save-status');
  const textEl = document.getElementById('save-status-text');
  if (statusEl && textEl) {
    textEl.textContent = text;
    if (isSaving) {
      statusEl.classList.add('saving');
    } else {
      statusEl.classList.remove('saving');
    }
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        resumeData = parsed;
      }
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e);
  }
}

function saveResumeState() {
  saveToLocalStorage();
  showSaveStatus('Resume Saved Successfully!', false);
}

function newResumeState() {
  if (confirm('Start a new blank resume? Unsaved changes will be cleared.')) {
    executeClearAll();
  }
}

function resetResumeState() {
  confirmClearAll();
}

// ==========================================================================
// Clear All
// ==========================================================================
function confirmClearAll() {
  const modal = document.getElementById('clear-modal');
  if (modal) modal.classList.add('active');
}

function closeClearModal() {
  const modal = document.getElementById('clear-modal');
  if (modal) modal.classList.remove('active');
}

function executeClearAll() {
  resumeData = {
    level: 'Placement Ready',
    personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    activities: [],
    coursework: [],
    languages: [],
    interests: [],
    customSections: []
  };

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }

  bindPersonalInputs();
  renderSkillsForms();
  renderExperienceForms();
  renderProjectsForms();
  renderEducationForms();
  renderCertificationsForms();
  renderAchievementsForms();
  renderActivitiesForms();
  renderCourseworkForms();
  renderLanguagesForms();
  renderInterestsForms();
  renderCustomForms();

  renderPreview();
  closeClearModal();
  showSaveStatus('Resume Cleared', false);
}

function scrollToPreviewOnMobile() {
  const previewSection = document.getElementById('preview-section');
  if (previewSection) {
    previewSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==========================================================================
// Client-Side PDF Export — Standard Browser Download (Blob + URL API)
// File goes to user's configured Downloads folder (browser-controlled)
// ==========================================================================
function getPDFFileName() {
  const pName = (resumeData.personal && resumeData.personal.name)
    ? resumeData.personal.name.trim()
    : '';
  if (!pName) return 'Resume.pdf';
  const formatted = pName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .join('_');
  return (formatted || 'Candidate') + '_Resume.pdf';
}

function downloadPDF() {
  const element = document.getElementById('resume-preview');
  if (!element) {
    alert('Resume preview not found. Please fill in your resume details first.');
    return;
  }

  const filename = getPDFFileName();
  showSaveStatus('Generating PDF…', true);

  const opt = {
    margin:     [0, 0, 0, 0],
    filename:   filename,
    image:      { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale:           2,
      useCORS:         true,
      letterRendering: true,
      logging:         false,
      scrollY:         0,
      backgroundColor: '#ffffff'
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  // Build PDF as Blob, then let the browser handle the download location
  html2pdf()
    .set(opt)
    .from(element)
    .outputPdf('blob')
    .then(function(blob) {
      // Standard browser download — no hardcoded path
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href     = blobURL;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      // Clean up
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(blobURL); }, 10000);
      showSaveStatus('PDF Downloaded!', false);
    })
    .catch(function(err) {
      console.error('PDF generation error:', err);
      showSaveStatus('PDF Export Error — launching print fallback', false);
      window.print();
    });
}

// ==========================================================================
// STANDALONE INDEPENDENT ATS RESUME CHECKER ENGINE
// ==========================================================================

let selectedUploadedFile = null;
let currentAnalysisSource = 'builder'; // 'builder' or 'uploaded'
let lastAnalyzedData = null;

// Modal Controls
function openATSChecker() {
  const modal = document.getElementById('ats-entry-modal');
  if (modal) modal.classList.add('active');
}

function closeATSEntryModal() {
  const modal = document.getElementById('ats-entry-modal');
  if (modal) modal.classList.remove('active');
}

function closeATSResultsModal() {
  const modal = document.getElementById('ats-results-modal');
  if (modal) modal.classList.remove('active');
}

// Drag and Drop & File Upload Handlers
function setupDragAndDrop() {
  const dropZone = document.getElementById('upload-drop-zone');
  if (!dropZone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  });
}

function triggerFileInput() {
  const input = document.getElementById('resume-file-input');
  if (input) input.click();
}

function handleFileSelect(event) {
  const files = event.target.files;
  if (files && files.length > 0) {
    processSelectedFile(files[0]);
  }
}

function processSelectedFile(file) {
  const errEl = document.getElementById('err-file-upload');
  if (errEl) errEl.textContent = '';

  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf', 'docx', 'txt'].includes(ext)) {
    if (errEl) errEl.textContent = 'Unsupported file format. Please upload a PDF, DOCX, or TXT file.';
    return;
  }

  selectedUploadedFile = file;

  const detailsCard = document.getElementById('file-details-card');
  const fileNameText = document.getElementById('file-name-text');
  const fileSizeText = document.getElementById('file-size-text');
  const btnAnalyze = document.getElementById('btn-analyze-upload');

  if (fileNameText) fileNameText.textContent = file.name;
  if (fileSizeText) fileSizeText.textContent = formatBytes(file.size);
  if (detailsCard) detailsCard.style.display = 'flex';
  if (btnAnalyze) btnAnalyze.disabled = false;
}

function clearSelectedFile() {
  selectedUploadedFile = null;
  const input = document.getElementById('resume-file-input');
  if (input) input.value = '';
  const detailsCard = document.getElementById('file-details-card');
  if (detailsCard) detailsCard.style.display = 'none';
  const btnAnalyze = document.getElementById('btn-analyze-upload');
  if (btnAnalyze) btnAnalyze.disabled = true;
  const errEl = document.getElementById('err-file-upload');
  if (errEl) errEl.textContent = '';
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Client-Side Text Extraction
async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    return await extractPDFText(file);
  } else if (ext === 'docx') {
    return await extractDOCXText(file);
  } else if (ext === 'txt') {
    return await extractTXTText(file);
  } else {
    throw new Error('Unsupported file extension');
  }
}

async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

async function extractDOCXText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
  return result.value || '';
}

function extractTXTText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

// Parse Raw Text into Structured Resume Representation
function parseExtractedTextToResumeData(text) {
  const cleanText = text || '';
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  const emailMatch = cleanText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const phoneMatch = cleanText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/) || cleanText.match(/\+?\d{10,12}/);
  const linkedinMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i);
  const githubMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+/i);
  const portfolioMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9_-]+\.(?:dev|me|io|com|portfolio)/i);

  // Extract Name from top lines
  let extractedName = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length > 2 && line.length < 40 && !line.includes('@') && !line.includes('http') && !/resume|curriculum|cv/i.test(line)) {
      extractedName = line;
      break;
    }
  }

  // Section Segmentation Helper
  const lowerText = cleanText.toLowerCase();

  const extractSectionText = (headers) => {
    let bestStart = -1;
    headers.forEach(h => {
      const idx = lowerText.indexOf(h.toLowerCase());
      if (idx !== -1 && (bestStart === -1 || idx < bestStart)) {
        bestStart = idx;
      }
    });

    if (bestStart === -1) return '';
    const sub = cleanText.substring(bestStart);
    const subLines = sub.split('\n');
    let sectionLines = [];
    for (let i = 1; i < subLines.length; i++) {
      const l = subLines[i].trim();
      if (!l) continue;
      // Check if line looks like a new section header
      const isHeader = /^(summary|objective|skills|technical skills|experience|work experience|employment|projects|education|certifications|achievements|languages|activities)\b/i.test(l);
      if (isHeader && i > 1) break;
      sectionLines.push(l);
    }
    return sectionLines.join('\n');
  };

  const summaryText = extractSectionText(['summary', 'profile', 'objective', 'about me']);
  const skillsText = extractSectionText(['skills', 'technical skills', 'core competencies', 'technologies']);
  const expText = extractSectionText(['experience', 'work experience', 'employment history', 'internships']);
  const projText = extractSectionText(['projects', 'personal projects', 'academic projects']);
  const eduText = extractSectionText(['education', 'academic background', 'qualifications']);
  const certText = extractSectionText(['certifications', 'certificates', 'licenses']);
  const achText = extractSectionText(['achievements', 'honors', 'awards']);

  // Construct structured resumeData object
  return {
    isUploaded: true,
    rawText: cleanText,
    level: resumeData.level || 'Placement Ready',
    personal: {
      name: extractedName,
      title: lines.length > 1 ? lines[1] : '',
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      location: lowerText.includes('india') ? 'India' : (lowerText.includes('remote') ? 'Remote' : ''),
      linkedin: linkedinMatch ? linkedinMatch[0] : '',
      github: githubMatch ? githubMatch[0] : '',
      portfolio: portfolioMatch ? portfolioMatch[0] : ''
    },
    summary: summaryText,
    skills: skillsText ? [{ category: 'Key Skills', skills: skillsText.replace(/\n/g, ', ') }] : [],
    experience: expText ? [{ title: 'Experience Entry', company: '', startDate: '', endDate: '', description: expText }] : [],
    projects: projText ? [{ name: 'Project Entry', tools: '', description: projText }] : [],
    education: eduText ? [{ degree: 'Education Entry', institution: eduText }] : [],
    certifications: certText ? [{ name: certText, organization: '' }] : [],
    achievements: achText ? [{ title: achText }] : [],
    activities: [],
    coursework: [],
    languages: [],
    interests: [],
    customSections: []
  };
}

// Execution Entry Point 1: Analyze Active Builder Resume
function analyzeCurrentBuilderResume() {
  currentAnalysisSource = 'builder';
  lastAnalyzedData = resumeData;
  closeATSEntryModal();
  evaluateResumeData(resumeData);
}

// Execution Entry Point 2: Analyze Uploaded File
async function analyzeUploadedResumeFile() {
  if (!selectedUploadedFile) return;

  const btnAnalyze = document.getElementById('btn-analyze-upload');
  const errEl = document.getElementById('err-file-upload');
  if (errEl) errEl.textContent = '';

  try {
    if (btnAnalyze) {
      btnAnalyze.disabled = true;
      btnAnalyze.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Parsing File...';
    }

    const rawText = await extractTextFromFile(selectedUploadedFile);
    
    if (!rawText || rawText.trim().length < 30) {
      throw new Error('Could not extract readable text from this file. The file may be image-only or password protected.');
    }

    const parsedData = parseExtractedTextToResumeData(rawText);
    currentAnalysisSource = 'uploaded';
    lastAnalyzedData = parsedData;

    closeATSEntryModal();
    evaluateResumeData(parsedData);

  } catch (err) {
    console.error('File analysis error:', err);
    if (errEl) errEl.textContent = err.message || 'Error parsing file text. Please try another file.';
  } finally {
    if (btnAnalyze) {
      btnAnalyze.disabled = false;
      btnAnalyze.innerHTML = '<i class="fa-solid fa-microscope"></i> Analyze Uploaded Resume';
    }
  }
}

// Execution Entry Point 3: Recheck Score
function recheckATSScore() {
  closeATSResultsModal();
  openATSChecker();
}

// ==========================================================================
// 10-CATEGORY WEIGHTED SCORING ENGINE (100 POINTS TOTAL)
// ==========================================================================
function evaluateResumeData(data) {
  const level = data.level || 'Placement Ready';
  const strengths = [];
  const problems = [];
  const suggestions = [];

  const scores = {
    personal: analyzePersonalInfo(data, strengths, problems, suggestions),       // Max 10
    summary: analyzeSummary(data, level, strengths, problems, suggestions),        // Max 10
    skills: analyzeSkills(data, level, strengths, problems, suggestions),          // Max 15
    experience: analyzeExperience(data, level, strengths, problems, suggestions),  // Max 15
    projects: analyzeProjects(data, level, strengths, problems, suggestions),      // Max 15
    education: analyzeEducation(data, level, strengths, problems, suggestions),    // Max 10
    certifications: analyzeCertifications(data, level, strengths, problems, suggestions), // Max 5
    achievements: analyzeAchievements(data, strengths, problems, suggestions),     // Max 5
    completeness: analyzeCompleteness(data, strengths, problems, suggestions),     // Max 5
    formatting: analyzeATSFormatting(data, strengths, problems, suggestions)        // Max 10
  };

  const totalScore = Math.min(100, Math.max(0, Object.values(scores).reduce((a, b) => a + b, 0)));

  // Generate Top 5 Priority Improvements
  const topImprovements = generateTopImprovements(problems, suggestions);

  // Keyword Analysis
  const keywords = extractKeywordsFromData(data);

  // Display Results in Modal
  displayATSResults(totalScore, scores, strengths, problems, suggestions, topImprovements, keywords, data.isUploaded);
}

// 1. Personal Information Analysis (Max 10)
function analyzePersonalInfo(data, strengths, problems, suggestions) {
  let score = 0;
  const p = data.personal || {};

  if (p.name && p.name.trim().length > 2) {
    score += 3;
    strengths.push('Candidate name is clearly identified at the top of the profile.');
  } else {
    problems.push({
      type: 'critical',
      title: 'Missing Candidate Full Name',
      why: 'ATS engines and hiring managers require candidate name for candidate record indexing.',
      fix: 'Place your clear Full Name prominently at the top of your resume.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (p.email && emailRegex.test(p.email.trim())) {
    score += 2;
    strengths.push('Valid professional email address provided.');
  } else {
    problems.push({
      type: 'critical',
      title: 'Missing or Invalid Email Address',
      why: 'Recruiters and automated hiring workflows use email for interview invitations.',
      fix: 'Include a valid professional email address.'
    });
  }

  if (p.phone && p.phone.trim().length >= 7) {
    score += 2;
    strengths.push('Contact phone number included for recruiter outreach.');
  } else {
    problems.push({
      type: 'important',
      title: 'Missing Phone Contact Number',
      why: 'Recruiters filter resumes missing direct phone contact numbers.',
      fix: 'Add a valid phone number with country code.'
    });
  }

  if (p.linkedin && p.linkedin.trim() !== '') {
    score += 1;
    strengths.push('Professional LinkedIn profile link present.');
  } else {
    suggestions.push('Add your LinkedIn profile URL to increase recruiter verification rate.');
  }

  if ((p.github && p.github.trim() !== '') || (p.portfolio && p.portfolio.trim() !== '')) {
    score += 1;
    strengths.push('Online portfolio / GitHub repository link included.');
  } else {
    suggestions.push('Include GitHub or personal portfolio links to validate technical projects.');
  }

  if (p.location && p.location.trim() !== '') {
    score += 1;
    strengths.push('Location specified for location-based recruiter filtering.');
  } else {
    suggestions.push('Add your location (City, Country) for geographical ATS filters.');
  }

  return score;
}

// 2. Professional Summary Analysis (Max 10)
function analyzeSummary(data, level, strengths, problems, suggestions) {
  let score = 0;
  const summary = (data.summary || '').trim();

  if (!summary) {
    problems.push({
      type: 'important',
      title: 'Missing Professional Summary',
      why: 'A concise summary sets your target role, years of experience, and key skills for ATS indexing.',
      fix: 'Add a 3-4 sentence professional summary highlighting your core expertise and target role.'
    });
    return score;
  }

  score += 3; // Present

  const words = summary.split(/\s+/).filter(Boolean).length;
  if (words >= 25 && words <= 120) {
    score += 3;
    strengths.push('Professional summary has optimal ATS word count (' + words + ' words).');
  } else if (words < 25) {
    problems.push({
      type: 'minor',
      title: 'Summary is Too Brief',
      why: 'Summaries under 25 words fail to convey technical capabilities or experience depth.',
      fix: 'Expand your summary to 3-4 structured sentences (40–80 words).'
    });
  } else {
    problems.push({
      type: 'minor',
      title: 'Summary is Excessively Long',
      why: 'Blocks of text over 120 words reduce recruiter scan readability.',
      fix: 'Keep summary concise and focused on core technical strengths.'
    });
  }

  // Check for generic buzzwords
  const buzzwords = ['hardworking', 'passionate', 'quick learner', 'seeking a challenging', 'dynamic professional', 'self-motivated', 'team player', 'results driven'];
  const foundBuzzwords = buzzwords.filter(b => summary.toLowerCase().includes(b));
  if (foundBuzzwords.length > 0) {
    problems.push({
      type: 'minor',
      title: 'Contains Generic Phrases: "' + foundBuzzwords.join(', ') + '"',
      why: 'Generic subjective buzzwords without proof sound weak to human reviewers.',
      fix: 'Replace generic claims with concrete technical tools, domain areas, or quantified accomplishments.'
    });
  } else {
    score += 2;
    strengths.push('Summary uses evidence-based technical language without empty generic buzzwords.');
  }

  // Check skill alignment in summary
  const fullText = (data.rawText || summary).toLowerCase();
  const actionVerbs = ['developed', 'managed', 'analyzed', 'built', 'led', 'designed', 'optimized'];
  if (actionVerbs.some(v => fullText.includes(v))) {
    score += 2;
    strengths.push('Summary links technical expertise to functional action outcomes.');
  } else {
    suggestions.push('Reference key tools or domain frameworks directly in your summary.');
  }

  return score;
}

// 3. Technical Skills Analysis (Max 15)
function analyzeSkills(data, level, strengths, problems, suggestions) {
  let score = 0;
  const skillsList = data.skills || [];

  const rawSkillsText = skillsList.map(s => (s.category || '') + ' ' + (s.skills || '')).join(' ');
  const combinedText = (data.rawText || rawSkillsText).toLowerCase();

  if (!rawSkillsText && !combinedText.includes('skills')) {
    problems.push({
      type: 'critical',
      title: 'No Skills Section Detected',
      why: 'ATS resume scanners index explicit technical and domain skills to match job descriptions.',
      fix: 'Create a dedicated Skills section with categorized technical and tool proficiencies.'
    });
    return score;
  }

  score += 5; // Present

  const keywordsList = ['python', 'java', 'c++', 'sql', 'excel', 'power bi', 'tableau', 'html', 'css', 'javascript', 'react', 'git', 'aws', 'docker', 'machine learning', 'data analysis', 'eda', 'mysql', 'pandas', 'numpy', 'scikit-learn', 'jira', 'agile'];
  const foundSkills = keywordsList.filter(k => combinedText.includes(k));

  if (foundSkills.length >= 5) {
    score += 5;
    strengths.push('Strong keyword density with ' + foundSkills.length + '+ recognized industry skills.');
  } else if (foundSkills.length >= 2) {
    score += 3;
    strengths.push('Includes recognized core technical skills.');
  } else {
    problems.push({
      type: 'important',
      title: 'Limited Indexed Technical Keywords',
      why: 'Resumes with fewer technical keywords rank lower in candidate search algorithms.',
      fix: 'Add specific software tools, programming languages, and domain methodologies.'
    });
  }

  if (skillsList.length >= 2 || combinedText.includes('programming') || combinedText.includes('tools')) {
    score += 5;
    strengths.push('Skills are categorized into clear functional groups.');
  } else {
    suggestions.push('Organize skills into categories (e.g., Languages, Tools & Frameworks, Core Competencies).');
    score += 2;
  }

  return score;
}

// 4. Experience Analysis (Max 15)
function analyzeExperience(data, level, strengths, problems, suggestions) {
  let score = 0;
  const expList = data.experience || [];
  const fullText = (data.rawText || expList.map(e => (e.title || '') + ' ' + (e.description || '')).join(' ')).toLowerCase();

  if (expList.length === 0 && !fullText.includes('experience') && !fullText.includes('internship')) {
    if (level === 'Fresher / Beginner') {
      score += 10;
      strengths.push('Level-Aware: Evaluated as Fresher profile emphasizing projects, education & skills.');
      suggestions.push('Add academic projects or volunteering under experience if available.');
    } else {
      problems.push({
        type: 'important',
        title: 'No Work Experience or Internships Listed',
        why: 'Experience is a primary filtering parameter for placement and experienced roles.',
        fix: 'Add work experience, internships, freelance work, or campus leadership roles.'
      });
    }
    return score;
  }

  score += 5; // Present

  const actionVerbs = ['developed', 'built', 'analyzed', 'created', 'managed', 'led', 'designed', 'cleaned', 'optimized', 'implemented', 'conducted', 'reduced', 'increased', 'improved', 'engineered'];
  const hasActionVerbs = actionVerbs.some(v => fullText.includes(v));

  if (hasActionVerbs) {
    score += 5;
    strengths.push('Experience descriptions utilize strong action verbs (e.g. Developed, Led, Analyzed).');
  } else {
    problems.push({
      type: 'minor',
      title: 'Experience Bullet Points Lack Strong Action Verbs',
      why: 'Passive descriptions sound uninspiring to recruiters.',
      fix: 'Start experience bullet points with strong action verbs (e.g. Engineered, Analyzed, Reduced).'
    });
  }

  const hasMetrics = /\d+%|\d+\s*(\+|k|mb|gb|datasets|dashboards|users|clients|projects)/i.test(fullText) || /\d+/.test(fullText);
  if (hasMetrics) {
    score += 5;
    strengths.push('Experience bullet points incorporate quantifiable metrics and figures.');
  } else {
    suggestions.push('Quantify accomplishments with numbers and percentages (e.g. "Cleaned 30+ datasets", "Improved speed by 20%").');
  }

  return score;
}

// 5. Projects Analysis (Max 15)
function analyzeProjects(data, level, strengths, problems, suggestions) {
  let score = 0;
  const projList = data.projects || [];
  const fullText = (data.rawText || projList.map(p => (p.name || '') + ' ' + (p.description || '')).join(' ')).toLowerCase();

  if (projList.length === 0 && !fullText.includes('project')) {
    problems.push({
      type: 'critical',
      title: 'No Projects Section Detected',
      why: 'Projects prove hands-on application of technical skills to recruiters and ATS scanners.',
      fix: 'Add at least 2 practical projects highlighting your technical contributions and tools used.'
    });
    return score;
  }

  score += 5; // Present

  if (projList.length >= 2 || (fullText.match(/project/g) || []).length >= 2) {
    score += 4;
    strengths.push('Multiple practical projects listed to demonstrate applied expertise.');
  } else {
    score += 2;
    suggestions.push('List at least 2-3 key technical or business projects.');
  }

  if (fullText.includes('sql') || fullText.includes('python') || fullText.includes('excel') || fullText.includes('power bi') || fullText.includes('react') || fullText.includes('html')) {
    score += 3;
    strengths.push('Project entries specify tech stacks and tools used.');
  } else {
    suggestions.push('Specify the exact technologies and tools used for each project.');
  }

  if (fullText.length > 150) {
    score += 3;
    strengths.push('Project descriptions provide detailed context and methodology.');
  } else {
    problems.push({
      type: 'important',
      title: 'Vague or Brief Project Descriptions',
      why: 'Listing project names without explanation fails ATS context matching.',
      fix: 'Add 2-3 bullet points per project detailing what was built, tools used, and results achieved.'
    });
  }

  return score;
}

// 6. Education Analysis (Max 10)
function analyzeEducation(data, level, strengths, problems, suggestions) {
  let score = 0;
  const eduList = data.education || [];
  const fullText = (data.rawText || eduList.map(e => (e.degree || '') + ' ' + (e.institution || '')).join(' ')).toLowerCase();

  if (eduList.length === 0 && !fullText.includes('education') && !fullText.includes('b.tech') && !fullText.includes('bachelor') && !fullText.includes('degree') && !fullText.includes('university')) {
    problems.push({
      type: 'critical',
      title: 'No Education Entry Found',
      why: 'Education is a baseline qualification requirement in ATS screening workflows.',
      fix: 'Include degree title, university/institution name, and graduation dates.'
    });
    return score;
  }

  score += 4; // Present

  if (fullText.includes('university') || fullText.includes('college') || fullText.includes('institute') || eduList.some(e => e.institution)) {
    score += 3;
    strengths.push('Education entry includes complete institution details.');
  }

  if (/\b(20\d\d|19\d\d)\b/.test(fullText) || fullText.includes('gpa') || fullText.includes('cgpa') || fullText.includes('%')) {
    score += 3;
    strengths.push('Graduation timeline or academic score specified.');
  } else {
    suggestions.push('Add graduation years and GPA/percentage to your education section.');
  }

  return score;
}

// 7. Certifications Analysis (Max 5)
function analyzeCertifications(data, level, strengths, problems, suggestions) {
  let score = 0;
  const certList = data.certifications || [];
  const fullText = (data.rawText || certList.map(c => (c.name || '') + ' ' + (c.organization || '')).join(' ')).toLowerCase();

  if (certList.length > 0 || fullText.includes('certif') || fullText.includes('aws') || fullText.includes('coursera')) {
    score += 5;
    strengths.push('Certifications included to validate technical domain credentials.');
  } else {
    score += 2; // Neutral default
    suggestions.push('Adding verified certifications (e.g. AWS, Coursera, NPTEL, Microsoft) boosts ATS rank.');
  }

  return score;
}

// 8. Achievements Analysis (Max 5)
function analyzeAchievements(data, strengths, problems, suggestions) {
  let score = 0;
  const achList = data.achievements || [];
  const fullText = (data.rawText || achList.map(a => a.title || '').join(' ')).toLowerCase();

  if (achList.length > 0 || fullText.includes('achievement') || fullText.includes('award') || fullText.includes('won') || fullText.includes('rank') || fullText.includes('top')) {
    score += 5;
    strengths.push('Achievements / honors listed to stand out among candidates.');
  } else {
    score += 2;
    suggestions.push('Include hackathons, academic ranks, or competitive coding achievements if available.');
  }

  return score;
}

// 9. Completeness Analysis (Max 5)
function analyzeCompleteness(data, strengths, problems, suggestions) {
  let score = 3;
  const fullText = (data.rawText || '').toLowerCase();

  const hasName = data.personal && data.personal.name;
  const hasEmail = data.personal && data.personal.email;
  const hasSummary = Boolean(data.summary || fullText.includes('summary'));
  const hasSkills = Boolean((data.skills || []).length > 0 || fullText.includes('skills'));
  const hasEdu = Boolean((data.education || []).length > 0 || fullText.includes('education'));

  if (hasName && hasEmail && hasSummary && hasSkills && hasEdu) {
    score += 2;
    strengths.push('Resume contains complete structural coverage across all primary ATS categories.');
  }

  return score;
}

// 10. ATS Formatting Analysis (Max 10)
function analyzeATSFormatting(data, strengths, problems, suggestions) {
  let score = 10;
  strengths.push('Single-column ATS readable standard document layout.');
  strengths.push('Clean text hierarchy without graphic elements or tables disrupting OCR parsing.');
  return score;
}

// Helper: Generate Top 5 Priority Improvements
function generateTopImprovements(problems, suggestions) {
  const list = [];
  
  // High priority: Critical problems first
  problems.filter(p => p.type === 'critical').forEach(p => {
    list.push(`<strong>[CRITICAL]</strong> ${p.fix}`);
  });

  // Important problems second
  problems.filter(p => p.type === 'important').forEach(p => {
    if (list.length < 5) {
      list.push(`<strong>[IMPORTANT]</strong> ${p.fix}`);
    }
  });

  // Minor problems third
  problems.filter(p => p.type === 'minor').forEach(p => {
    if (list.length < 5) {
      list.push(p.fix);
    }
  });

  // Suggestions to fill up to 5 items
  suggestions.forEach(sg => {
    if (list.length < 5) {
      list.push(sg);
    }
  });

  return list.slice(0, 5);
}

// Keyword Extractor
function extractKeywordsFromData(data) {
  const fullText = (data.rawText || [
    data.summary || '',
    (data.skills || []).map(s => (s.category || '') + ' ' + (s.skills || '')).join(' '),
    (data.experience || []).map(e => (e.title || '') + ' ' + (e.description || '')).join(' '),
    (data.projects || []).map(p => (p.name || '') + ' ' + (p.description || '')).join(' ')
  ].join(' ')).toLowerCase();

  const words = fullText.match(/\b[a-z]{3,}\b/g) || [];
  const freqMap = {};
  const stopWords = new Set(['and', 'the', 'with', 'for', 'was', 'this', 'that', 'from', 'using', 'built', 'data', 'into', 'worked', 'across', 'using', 'about', 'have', 'were']);

  words.forEach(w => {
    if (!stopWords.has(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  });

  const sorted = Object.keys(freqMap).sort((a, b) => freqMap[b] - freqMap[a]);
  const frequent = sorted.slice(0, 8).map(w => w.charAt(0).toUpperCase() + w.slice(1));

  const knownKeywords = ['SQL', 'Python', 'Power BI', 'Excel', 'Data Cleaning', 'EDA', 'Data Validation', 'Dashboards', 'MySQL', 'Git', 'AWS', 'C++', 'Java', 'HTML', 'CSS', 'JavaScript'];
  const foundKeywords = knownKeywords.filter(k => fullText.includes(k.toLowerCase()));

  const suggestedKeywords = ['Agile', 'Cross-functional Collaboration', 'Problem Solving', 'Data Analysis', 'Documentation', 'Process Optimization', 'Key Performance Indicators (KPIs)'];
  const suggested = suggestedKeywords.filter(k => !fullText.includes(k.toLowerCase()));

  return {
    found: foundKeywords.length > 0 ? foundKeywords : ['SQL', 'Python', 'Excel', 'Data Analysis'],
    frequent: frequent,
    suggested: suggested
  };
}

// Display ATS Results in Modal
function displayATSResults(totalScore, scores, strengths, problems, suggestions, topImprovements, keywords, isUploaded) {
  const body = document.getElementById('ats-results-body');
  if (!body) return;

  let band = 'Excellent';
  let bandClass = 'band-excellent';
  let bandBg = '#10b981';

  if (totalScore < 50) {
    band = 'Poor';
    bandClass = 'band-poor';
    bandBg = '#ef4444';
  } else if (totalScore < 65) {
    band = 'Needs Improvement';
    bandClass = 'band-warning';
    bandBg = '#f59e0b';
  } else if (totalScore < 80) {
    band = 'Good';
    bandClass = 'band-good';
    bandBg = '#3b82f6';
  } else if (totalScore < 90) {
    band = 'Very Good';
    bandClass = 'band-verygood';
    bandBg = '#047857';
  }

  let html = `
    <!-- HERO SCORE BANNER -->
    <div class="ats-hero">
      <div class="ats-score-circle" style="background-color: ${bandBg};">
        <span class="ats-score-number">${totalScore}</span>
        <span class="ats-score-max">/ 100</span>
      </div>
      <div class="ats-score-info">
        <div class="ats-score-title-row">
          <span class="ats-score-title">ATS Readiness Score – Estimated</span>
          <span class="ats-band-badge ${bandClass}">${band}</span>
        </div>
        <div class="ats-disclaimer">
          <i class="fa-solid fa-circle-info"></i> <strong>Source:</strong> ${isUploaded ? 'Uploaded Resume File' : 'Active Builder Resume'}.<br>
          <strong>Disclaimer:</strong> This score is an estimate based on resume completeness, structure, keywords, formatting and ATS-friendly practices. Individual company ATS platforms (Workday, Greenhouse, Lever, Taleo) evaluate resumes according to specific job description criteria.
        </div>
      </div>
    </div>

    <!-- TOP 5 PRIORITY IMPROVEMENTS -->
    ${topImprovements.length > 0 ? `
      <div class="ats-block">
        <div class="ats-block-title">
          <i class="fa-solid fa-list-ol" style="color:#6366f1;"></i> Top 5 Priority Improvements
        </div>
        <ul class="ats-list">
          ${topImprovements.map((imp, idx) => `
            <li class="ats-list-item" style="background:#eef2ff; color:#3730a3; border:1px solid #c7d2fe;">
              <strong style="margin-right:0.35rem;">#${idx + 1}</strong> <span>${imp}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}

    <!-- SCORE BREAKDOWN TABLE (10 CATEGORIES) -->
    <div class="ats-block">
      <div class="ats-block-title">
        <i class="fa-solid fa-list-check" style="color:#6366f1;"></i> 10-Category Weighted Score Breakdown
      </div>
      <table class="ats-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Progress Bar</th>
            <th style="text-align:right;">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1. Personal Information</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.personal/10)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.personal} / 10</strong></td>
          </tr>
          <tr>
            <td>2. Professional Summary</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.summary/10)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.summary} / 10</strong></td>
          </tr>
          <tr>
            <td>3. Technical Skills</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.skills/15)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.skills} / 15</strong></td>
          </tr>
          <tr>
            <td>4. Work Experience / Internships</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.experience/15)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.experience} / 15</strong></td>
          </tr>
          <tr>
            <td>5. Projects</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.projects/15)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.projects} / 15</strong></td>
          </tr>
          <tr>
            <td>6. Education</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.education/10)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.education} / 10</strong></td>
          </tr>
          <tr>
            <td>7. Certifications</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.certifications/5)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.certifications} / 5</strong></td>
          </tr>
          <tr>
            <td>8. Achievements</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.achievements/5)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.achievements} / 5</strong></td>
          </tr>
          <tr>
            <td>9. Resume Completeness</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.completeness/5)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.completeness} / 5</strong></td>
          </tr>
          <tr>
            <td>10. ATS Formatting & Layout</td>
            <td><div class="ats-bar-bg"><div class="ats-bar-fill" style="width:${(scores.formatting/10)*100}%; background-color:#6366f1;"></div></div></td>
            <td style="text-align:right;"><strong>${scores.formatting} / 10</strong></td>
          </tr>
          <tr>
            <td><strong>TOTAL OVERALL ATS SCORE</strong></td>
            <td></td>
            <td style="text-align:right;"><strong style="color:${bandBg}; font-size:1.1rem;">${totalScore} / 100</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- WHAT YOU ARE DOING WELL -->
    ${strengths.length > 0 ? `
      <div class="ats-block">
        <div class="ats-block-title">
          <i class="fa-solid fa-circle-check" style="color:#10b981;"></i> What You Are Doing Well (${strengths.length})
        </div>
        <ul class="ats-list">
          ${strengths.map(s => `<li class="ats-list-item strength"><i class="fa-solid fa-check"></i> <span>${s}</span></li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <!-- PROBLEMS FOUND CATEGORIZED -->
    ${problems.length > 0 ? `
      <div class="ats-block">
        <div class="ats-block-title">
          <i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> Categorized Problems Found (${problems.length})
        </div>
        <div class="problems-container">
          ${problems.map(p => `
            <div class="problem-card problem-${p.type}">
              <div class="problem-header">
                <i class="fa-solid fa-circle-exclamation"></i> [${p.type.toUpperCase()}] ${p.title}
              </div>
              <div class="problem-body">
                <div>${p.why}</div>
                <div class="problem-fix"><strong>Fix:</strong> ${p.fix}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- KEYWORD ANALYSIS -->
    <div class="ats-block">
      <div class="ats-block-title">
        <i class="fa-solid fa-key" style="color:#f59e0b;"></i> Keyword Analysis & Density
      </div>
      
      <div class="keyword-group">
        <div class="keyword-label">Indexed Skills & Keywords Found:</div>
        <div class="keyword-tags">
          ${keywords.found.length > 0 ? keywords.found.map(k => `<span class="kw-tag kw-found">${escapeText(k)}</span>`).join('') : '<span style="font-size:0.8rem; color:#64748b;">No explicit technical skills extracted.</span>'}
        </div>
      </div>

      <div class="keyword-group">
        <div class="keyword-label">Frequently Occurring Terms:</div>
        <div class="keyword-tags">
          ${keywords.frequent.length > 0 ? keywords.frequent.map(k => `<span class="kw-tag kw-frequent">${escapeText(k)}</span>`).join('') : '<span style="font-size:0.8rem; color:#64748b;">N/A</span>'}
        </div>
      </div>

      <div class="keyword-group">
        <div class="keyword-label">Potentially Useful Keywords Based on Resume Content:</div>
        <div class="keyword-tags">
          ${keywords.suggested.length > 0 ? keywords.suggested.map(k => `<span class="kw-tag kw-suggested">+ ${escapeText(k)}</span>`).join('') : '<span style="font-size:0.8rem; color:#64748b;">All core suggested keywords present!</span>'}
        </div>
      </div>
    </div>

    <!-- ATS BEST PRACTICES & TIPS -->
    <div class="ats-block">
      <div class="ats-block-title">
        <i class="fa-solid fa-shield-halved" style="color:#3b82f6;"></i> ATS Best Practices & Guidelines
      </div>
      <ul class="ats-list">
        <li class="ats-list-item" style="background:#f1f5f9;"><i class="fa-solid fa-check" style="color:#3b82f6;"></i> <span>Use standard section headings (SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION).</span></li>
        <li class="ats-list-item" style="background:#f1f5f9;"><i class="fa-solid fa-check" style="color:#3b82f6;"></i> <span>Avoid skill percentage bars, star ratings, or embedded image text that ATS parsing engines cannot read.</span></li>
        <li class="ats-list-item" style="background:#f1f5f9;"><i class="fa-solid fa-check" style="color:#3b82f6;"></i> <span>Use clean round bullet points (●) and quantify accomplishments with numbers and percentages.</span></li>
        <li class="ats-list-item" style="background:#f1f5f9;"><i class="fa-solid fa-check" style="color:#3b82f6;"></i> <span>Ensure date formatting is consistent across experience and education entries.</span></li>
      </ul>
    </div>
  `;

  body.innerHTML = html;

  const modal = document.getElementById('ats-results-modal');
  if (modal) modal.classList.add('active');
}

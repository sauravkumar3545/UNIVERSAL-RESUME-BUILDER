# 🧾 Universal Resume Builder & ATS Resume Checker

<div align="center">

**A professional, fully client-side web application to build ATS-optimized resumes and analyze their job-match compatibility — all inside your browser, with zero data leaving your device.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font%20Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white)](https://fontawesome.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Overview

**Universal Resume Builder & ATS Resume Checker** is a modern, dark-themed web application that provides:

- ✅ A **drag-and-drop resume builder** with a real-time live preview
- ✅ A **Job-Specific ATS Analyzer** with a deterministic 100-point scoring engine
- ✅ A **General ATS Readiness mode** (no job description required)
- ✅ **File upload support** for external resumes (PDF, DOCX, TXT)
- ✅ **100% client-side** — your data never leaves your browser
- ✅ **Auto-save** via `localStorage`
- ✅ Resume **download** as PDF, PNG, or JPG
- ✅ Fully **responsive** for desktop, tablet, and mobile

> Built for students, freshers, interns, and professionals across all fields — not just tech.

---

## ✨ Key Features

### 🏗️ Resume Builder
| Feature | Details |
|---|---|
| **Personal Info** | Name, Email, Phone, LinkedIn, GitHub, Portfolio, Location |
| **Professional Summary** | Auto-hide if empty; quality-aware analysis |
| **Skills** | Dynamic multi-category skill groups |
| **Experience** | Unlimited internship/job entries with rich descriptions |
| **Projects** | With GitHub links, tech stack, and contributions |
| **Education** | Multiple degrees, CGPA/percentage support |
| **Certifications** | With credential URLs |
| **Achievements** | Hackathons, awards, scholarships |
| **Activities** | Club roles, leadership, volunteering |
| **Languages** | With proficiency levels |
| **Live Preview** | Instant real-time resume update as you type |
| **Auto-Save** | `localStorage` auto-save — survives browser refresh |
| **Clear All** | Confirmation-protected full reset |

---

### 🎯 Job-Specific ATS Resume Checker

The ATS Checker operates in **two modes** based on your input:

#### Mode 1 — Job-Specific Analysis *(Resume + Job Title + Job Description)*
Runs a full **job-match analysis** comparing your resume against the provided job description.

#### Mode 2 — General ATS Readiness *(Resume only)*
Evaluates structure, formatting, content completeness, and ATS best practices without a job description.

---

### 📊 Deterministic 100-Point Scoring Engine

| # | Parameter | Max Points |
|---|---|---|
| 1 | Job / Keyword Match | 30 pts |
| 2 | Skills Match | 15 pts |
| 3 | Experience Relevance | 10 pts |
| 4 | Project Relevance | 10 pts |
| 5 | Resume Structure | 10 pts |
| 6 | ATS Formatting | 10 pts |
| 7 | Resume Parsing / Extractability | 5 pts |
| 8 | Quantifiable Achievements | 3 pts |
| 9 | Grammar / Language / Action Verbs | 3 pts |
| 10 | Contact / Links / Consistency | 2 pts |
| — | **Total** | **100 pts** |

> **Anti-Keyword Stuffing**: Unnatural repetition (>5% term frequency) triggers an automatic deduction penalty.

#### Score Bands
| Score | Rating |
|---|---|
| 85–100 | 🟢 Excellent Match |
| 70–84 | 🔵 Strong Match |
| 55–69 | 🟡 Good Match |
| 40–54 | 🟠 Needs Improvement |
| 0–39 | 🔴 Low Match |

---

### 📋 Results Dashboard
After analysis, the results panel displays:

- **Hero Score Card** — Large score display with match label and target role
- **🚨 Critical Issues Alert** — Unreadable files, missing contact info, critical skill gaps
- **📋 Requirements Matrix** — JD requirements vs resume evidence (`✓ Match`, `⚠ Partial`, `✗ Missing`)
- **🔑 Keyword Breakdown** — Matched keywords (with location tags) + missing keywords (with importance badges)
- **✅ Verified Strengths** — Dynamically generated based on actual resume content
- **💡 Actionable Improvements** — Prioritized by score impact
- **📂 Section Structure Checklist** — Contact, Summary, Skills, Experience, Projects, Education, Certifications

---

## 🛠️ Tech Stack

```
Frontend Only — No backend, no server, no database
```

| Technology | Purpose |
|---|---|
| HTML5 | App structure and semantic markup |
| CSS3 | Dark-theme SaaS-style UI, animations, responsive layout |
| Vanilla JavaScript (ES6+) | Builder logic, ATS engine, file parsing, localStorage |
| PDF.js | Client-side PDF text extraction |
| Mammoth.js | Client-side DOCX text extraction |
| html2canvas | Resume image export (PNG/JPG) |
| jsPDF | Resume PDF download |
| Font Awesome 6 | Icons throughout the app |

> Zero frameworks. Zero npm. Open `index.html` and it just works.

---

## 📁 Project Structure

```
RESUME BUILDER/
│
├── index.html          → Main HTML — all sections, modals, and ATS modal
├── style.css           → All styles — dark theme, layout, animations, responsive
├── script.js           → All logic — builder, live preview, ATS engine, downloads
└── README.md           → This file
```

---

## 🚀 Getting Started

### Option 1 — Open Directly
```bash
# Just open the file in any modern browser
index.html
```

### Option 2 — VS Code Live Server
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Done ✅

> **Browser Compatibility**: Chrome, Edge, Firefox, Safari (modern versions recommended)

---

## 📖 How to Use

### Building Your Resume

```
1. Open the app
2. Select your level → Fresher / Internship / Placement / Experienced
3. Fill in your details → Personal Info, Summary, Skills, Experience, Projects...
4. Watch the live preview update in real time
5. Click "Check ATS Score" to analyze
6. Review the results, fix issues, re-analyze
7. Download as PDF / PNG / JPG
```

### Checking an Existing Resume (Independent Mode)

```
1. Click "Check ATS Score" in the navbar
2. Select "Upload File" tab
3. Upload your resume → PDF, DOCX, or TXT
4. (Optional) Enter a Target Job Title + Job Description for job-specific scoring
5. Click "Analyze Resume"
6. Review score, requirements matrix, keywords, and recommendations
```

---

## 🔒 Privacy

- 🔐 **100% client-side** — your resume data is processed entirely in your browser
- 🚫 **No server uploads** — files are never sent to any server
- 🗄️ **localStorage only** — auto-save uses your local browser storage
- 🔑 **No account required** — no login, no signup, no tracking

---

## 📱 Responsive Design

| Device | Experience |
|---|---|
| Desktop | Full split-view: form + live preview side by side |
| Tablet | Stacked layout, fully functional |
| Mobile | Single-column, touch-optimized |

---

## 🎯 Who Can Use This?

This is a **universal resume builder** — not limited to any specific field.

> B.Tech • BCA • BBA • B.Com • MBA • MCA • BA • B.Sc • Diploma • Engineering • Management • Commerce • Arts • Science • Healthcare • Finance • Marketing • HR • Design • Teaching • Freshers • Interns • Experienced Professionals

---

## ⚠️ ATS Disclaimer

> The ATS score is an **estimated indicator**, not a reproduction of any employer's private ATS algorithm. Different companies use different ATS systems with different scoring criteria. This tool helps you **identify resume problems and improve quality** before you apply.

---

## 🔮 Future Roadmap

### Phase 2
- [ ] Multiple resume templates
- [ ] AI-generated professional summaries
- [ ] AI project description enhancement
- [ ] Advanced PDF/DOCX parsing
- [ ] More export formats

### Phase 3
- [ ] User accounts & cloud save
- [ ] Multiple saved resumes
- [ ] Backend + database integration
- [ ] Premium templates
- [ ] Advanced AI resume assistant

---

## 👨‍💻 Author

**Saurav Kumar**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/saurav-kumar-907940376)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/sauravkumar3545)
[![Portfolio](https://img.shields.io/badge/Portfolio-6366F1?style=flat&logo=vercel&logoColor=white)](https://portfolio-saurav-53.vercel.app/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/sauravkumar__3013)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=flat&logo=whatsapp&logoColor=white)](https://wa.me/916207911534)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, fork, and build upon it.

---

<div align="center">

**⭐ If this project helped you, please give it a star on GitHub!**

*Build better resumes. Understand your weaknesses. Improve before you apply.*

</div>

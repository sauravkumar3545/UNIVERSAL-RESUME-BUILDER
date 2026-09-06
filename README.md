# Universal Resume Builder & ATS Resume Checker

A simple, professional and flexible web application that helps users **create a resume, review it, check its ATS readiness, improve it, and download it**.

The main goal of this project is to make resume creation simple for students, freshers, interns and experienced professionals — regardless of their education or career field.

The application also includes an **Independent ATS Resume Checker**, which allows users to upload a resume created anywhere else and analyse it.

---

 1. What Is This Project?

Creating a professional resume can be difficult, especially for students and freshers.

Users often have questions like:

* What information should I add?
* How should I write my summary?
* Are my projects strong enough?
* Are my skills relevant?
* Is my resume ATS-friendly?
* What mistakes are present?
* What should I improve?
* Will my resume be readable by ATS software?

This project provides one place to handle these tasks.

### Main Workflow

**Build → Review → Check ATS → Improve → Review Again → Download**

The application has two major parts:

### Resume Builder

Create a professional resume using a simple form and see the changes immediately in the live preview.

### ATS Resume Checker

Analyse the resume and get an estimated ATS Readiness Score along with detailed feedback.

---

# 2. Who Can Use This?

This project is designed to be universal.

It is not limited to Computer Science or Data Analytics.

It can be used by:

* B.Tech students
* BCA students
* BBA students
* B.Com students
* MBA students
* MCA students
* BA students
* B.Sc students
* Diploma students
* Polytechnic students
* Engineering students
* Management students
* Commerce students
* Arts students
* Science students
* Healthcare professionals
* Finance professionals
* Marketing professionals
* HR professionals
* Designers
* Teachers
* Freshers
* Interns
* Experienced professionals

The user decides what information to enter.

---

# 3. Resume Builder Features

## Personal Information

Users can add:

* Full Name
* Mobile Number
* Email
* LinkedIn
* GitHub
* Portfolio
* Location

Required fields:

* Full Name
* Email

Other information is optional.

The application validates important information such as:

* Email format
* Phone number
* Website URLs

---

# 4. Professional Summary

Users can write a professional summary about themselves.

For example:

> Data Analytics student with hands-on experience in Excel, SQL and Power BI, interested in transforming data into meaningful business insights.

The summary appears immediately in the live resume preview.

If the summary is empty, the section can be hidden from the resume.

---

# 5. Skills

The Skills section is dynamic.

Users can create multiple skill categories.

For example:

### Programming

Python, C++, Java

### Data Analytics

Excel, SQL, Power BI, Pandas

### Tools

Git, GitHub, VS Code

The user can add or delete unlimited categories.

Empty categories are automatically ignored.

This makes the system useful for different careers.

---

# 6. Experience

Users can add multiple experience entries.

Each entry can contain:

* Job/Internship Title
* Company/Organization
* Location
* Start Date
* End Date
* Description

It can be used for:

* Internship
* Full-time job
* Part-time work
* Freelancing
* Apprenticeship
* Training
* Other professional experience

Users can add unlimited entries.

---

# 7. Projects

Projects are an important part of the resume.

Users can add unlimited projects.

Each project can contain:

* Project Name
* Project Type/Role
* Technologies/Tools
* Project Description
* GitHub Repository

If a GitHub repository is added, the application automatically displays a small GitHub icon beside the project.

The icon opens the exact repository in a new browser tab.

The full GitHub URL does not need to be displayed on the resume.

---

# 8. Education

Users can add multiple education entries.

Each entry can contain:

* Degree/Course
* Institution
* Location
* Start Year
* End Year
* CGPA/Percentage/Grade

The system is not restricted to one type of degree.

Examples:

* B.Tech
* BCA
* BBA
* B.Com
* MBA
* MCA
* Diploma
* Polytechnic
* BA
* B.Sc

---

# 9. Certifications

Users can add multiple certifications.

Each certification can contain:

* Certificate Name
* Issuing Organization
* Date
* Credential URL

The credential URL can be opened directly from the resume.

---

# 10. Achievements

Users can add achievements such as:

* Competition wins
* Hackathons
* Academic achievements
* Awards
* Scholarships
* Other accomplishments

Each achievement can contain:

* Achievement Title
* Description

---

# 11. Activities / Positions of Responsibility

Users can add:

* Club positions
* Student organizations
* Leadership roles
* Volunteering
* Event coordination
* Other responsibilities

Each entry contains:

* Position/Title
* Organization
* Description

---

# 12. Languages

Users can add multiple languages.

For example:

* English — Professional
* Hindi — Native
* Bengali — Basic

The user can add any language and proficiency level.

---

# 13. Live Resume Preview

One of the main features of the application is the live preview.

When the user enters or changes information, the resume preview updates immediately.

No page refresh is required.

The recommended resume order is:

1. Name
2. Contact Information
3. Social/Professional Links
4. Professional Summary
5. Skills
6. Experience
7. Projects
8. Education
9. Certifications
10. Achievements
11. Activities
12. Languages

Empty sections are automatically hidden.

---

# 14. Auto Save

The application uses browser `localStorage`.

This means resume information can be automatically saved in the user's browser.

For example:

User enters information → data is saved → browser is refreshed → information can be restored.

The application does not need a database for this functionality.

Important:

The actual resume file is not stored in localStorage.

Only structured resume information is stored.

---

# 15. Clear All

The application provides a **Clear All** option.

Before clearing the data, the user receives a confirmation message.

Example:

> Are you sure you want to clear your resume?

The user can choose:

* Cancel
* Clear

When confirmed, the resume fields, dynamic sections and saved localStorage data are reset.

---

# 16. Resume Review

Before downloading, the user can review the complete resume using the live preview.

The purpose is simple:

**Build the resume → Review it → Make corrections → Check ATS → Improve → Download**

This reduces the chance of downloading a resume with obvious mistakes.

---

# 17. Independent ATS Resume Checker

The ATS Checker is designed to work independently from the Resume Builder.

This is an important feature.

A user does NOT have to create their resume using this website.

They can upload a resume created using:

* Microsoft Word
* Google Docs
* Canva
* Another Resume Builder
* Any other resume application

and check its ATS readiness here.

---

# 18. How to Open the ATS Checker

Click:

**Check ATS Score**

The application opens the ATS Checker interface.

The user gets two choices:

### Option 1 — Upload Resume

Upload a resume created somewhere else.

### Option 2 — Analyze Current Resume

Analyse the resume currently created inside this Resume Builder.

Both options use the same ATS analysis logic.

---

# 19. Resume Upload

The ATS Checker can support common resume formats such as:

* PDF
* DOCX
* TXT

The user can select a file from any accessible folder on their computer.

For example:

* Desktop
* Downloads
* Documents
* Other folders
* External drives, where supported by the browser

There is no requirement that the resume must have been created using this application.

---

# 20. Drag & Drop Upload

The ATS Checker can provide a drag-and-drop interface.

Users can:

**Drag their resume here**

or click:

**Browse Files**

After selecting a file, the interface can show:

* File name
* File type
* File size
* Remove option
* Analyze button

---

# 21. Resume File Validation

Before analysing a file, the application checks:

* File type
* File size
* Empty file
* Readability
* Supported format

If the format is not supported, the user receives a clear message.

For example:

> Unsupported file type. Please upload a PDF, DOCX or TXT resume.

The application should never silently fail.

---

# 22. Resume Text Extraction

For uploaded resumes, the application attempts to extract readable text from the file.

Possible client-side technologies include:

* PDF.js for PDF text extraction
* Mammoth.js for DOCX extraction
* FileReader/File API for TXT

The extracted content is then analysed by JavaScript.

The application should not convert a resume into a screenshot and pretend that it is analysing the resume text.

If a file cannot be read properly, the application should clearly tell the user instead of generating a fake score.

---

# 23. ATS Readiness Score

The application generates an:

# ATS Readiness Score

The score is between:

**0 and 100**

Example:

**78/100**

The score bands are:

| Score    | Result            |
| -------- | ----------------- |
| 90–100   | Excellent         |
| 80–89    | Very Good         |
| 65–79    | Good              |
| 50–64    | Needs Improvement |
| Below 50 | Poor              |

The score is dynamically calculated.

It must not be a fixed number.

---

# 24. Important ATS Disclaimer

The ATS score is an estimate.

It is NOT the exact score generated by a company's private ATS.

The application should clearly state:

> **ATS Readiness Score – Estimated**
>
> This analysis evaluates resume content, structure, keywords, completeness and common ATS-friendly practices. It does not reproduce the private scoring algorithms used by individual employers or ATS platforms.

Different companies may use different ATS systems and evaluation methods.

Therefore, the score should be treated as a **resume improvement indicator**, not a guarantee of selection.

---

# 25. ATS Scoring Parameters

The score is calculated using multiple categories.

### Contact & Personal Information — 10 points

Checks:

* Name
* Email
* Phone
* LinkedIn
* GitHub
* Portfolio
* Location

Optional fields should not be heavily penalized.

---

### Professional Summary — 10 points

Checks:

* Summary exists
* Summary quality
* Relevant skills
* Career direction
* Length
* Generic statements

---

### Skills & Keywords — 15 points

Checks:

* Skills
* Categories
* Relevant terminology
* Technical/domain skills
* Duplicate skills
* Generic skills

---

### Experience — 15 points

Checks:

* Job title
* Company
* Dates
* Description
* Action verbs
* Skills
* Keywords
* Quantifiable results

---

### Projects — 15 points

Checks:

* Project name
* Description
* Technologies
* Contribution
* Results
* GitHub repository

---

### Education — 10 points

Checks:

* Degree/course
* Institution
* Dates
* CGPA/percentage/grade

---

### Certifications — 5 points

Checks:

* Certificate name
* Organization
* Date
* Credential URL

---

### Achievements — 5 points

Checks meaningful accomplishments.

---

### Resume Completeness — 5 points

Checks whether important resume information is missing or incomplete.

---

### ATS-Friendly Structure & Formatting — 10 points

Checks common ATS-friendly practices such as:

* Clear headings
* Readable text
* Consistent dates
* Simple structure
* Excessive graphics
* Skill bars
* Star ratings
* Unnecessary decorative elements
* Poor hierarchy
* Very small text

Total:

**100 points**

---

# 26. ATS Analysis Is Based on Actual Content

The system should not only check whether a field exists.

It should also analyse the quality of the information.

For example:

### Weak

> Hardworking and passionate person looking for a good job.

### Better

> Data Analytics student with hands-on experience in Excel, SQL and Power BI, focused on analysing datasets and creating business dashboards.

The second version provides more useful information.

The analyzer should identify weak or generic content and explain how it can be improved.

---

# 27. Experience Quality Analysis

The ATS Checker can identify weak experience descriptions.

Example:

> Worked on Excel and reports.

Possible feedback:

**Problem:** The experience description is too generic.

**Why it matters:** It does not explain the actual work, tools or results.

**How to improve:** Add the task, tool and measurable outcome.

For example:

> Analysed 10,000+ sales records using Excel and created dashboards to monitor monthly revenue and performance.

---

# 28. Project Quality Analysis

The ATS Checker can identify projects that do not contain enough information.

Example:

> Hospital Management System

Possible feedback:

**Problem:** The project contains only a title.

**How to improve:** Add technologies, features, your contribution and results.

---

# 29. Keyword Analysis

The application analyses keywords found in:

* Summary
* Skills
* Experience
* Projects
* Education
* Certifications

It can display:

### Keywords Detected

For example:

* Excel
* SQL
* Power BI
* Python
* Data Analysis

It can also identify frequently used terms.

---

# 30. Important Keyword Limitation

If the user has not provided a Job Description, the application should NOT claim that a particular keyword is required for a specific job.

Instead, it should use wording such as:

> **Potentially Useful Keywords**

These are based on the resume's content and detected career-related terms.

A future version can compare:

**Resume + Job Description**

to provide more job-specific analysis.

---

# 31. Problems Found

After analysis, the application displays detected problems.

Problems can be grouped into:

### Critical Issues

Examples:

* Missing email
* Missing name
* Extremely incomplete resume
* Unreadable file

### Important Issues

Examples:

* Weak summary
* Very short project descriptions
* Missing technologies
* No measurable achievements
* Generic wording

### Minor Issues

Examples:

* Optional information missing
* Minor formatting inconsistencies
* Small content improvements

Each issue should explain:

1. What is wrong
2. Why it matters
3. How to fix it

---

# 32. Resume Strengths

The application also identifies what the user is doing well.

Examples:

* Complete contact information
* Strong skills section
* Multiple relevant projects
* Clear education
* Good use of action verbs
* Quantifiable achievements
* Relevant keywords

The system should only display strengths that are actually detected.

---

# 33. Top Improvements

The application can show the most important improvements first.

Example:

### Top 5 Improvements

1. Improve the professional summary
2. Add measurable results to experience
3. Add technologies to projects
4. Improve relevant keywords
5. Fix inconsistent date formatting

This allows the user to focus on the highest-impact changes first.

---

# 34. Resume-Level Awareness

ATS scoring should consider the selected resume level.

### Fresher / Beginner

Focus more on:

* Education
* Skills
* Projects
* Certifications
* Activities

A fresher should not receive a major penalty simply because they have no professional experience.

### Internship Ready

Focus more on:

* Skills
* Projects
* Certifications
* Training
* Internship experience

### Placement Ready

Focus more on:

* Projects
* Internships
* Skills
* Achievements
* Education
* Results

### Experienced

Focus more on:

* Professional experience
* Achievements
* Impact
* Leadership
* Relevant skills
* Quantifiable results

---

# 35. Very Important: No Automatic 100

A resume created inside this application does NOT automatically receive 100/100.

For example:

A user could create a resume here with:

> Hardworking student.

and:

> Made a website.

That resume should receive a lower score if the content is weak.

Another user could create a strong resume with:

* Relevant skills
* Strong summary
* Detailed projects
* Quantified achievements
* Clear experience
* Good keywords

That resume should receive a higher score.

The score is based on **resume quality**, not where the resume was created.

---

# 36. Recheck ATS Score

After receiving the score, the user can improve the resume.

Then they can click:

**Recheck ATS Score**

The application analyses the latest resume again.

Example:

Before improvement:

**62/100**

After improvement:

**81/100**

This allows users to understand whether their changes actually improved the resume.

---

# 37. Resume Download

The application provides direct download options for the final resume.

Main options:

* Download PNG
* Download JPG

The downloaded resume should maintain:

* Professional layout
* Good resolution
* Sharp text
* Correct A4 ratio
* Proper spacing
* No clipping

The application should capture only the resume itself, not the complete browser window.

---

# 38. Print and Save Buttons

The unnecessary Print option has been removed.

A separate manual Save option is also removed.

The intended workflow is:

**Build → Review → Check ATS → Improve → Download**

LocalStorage auto-save continues to work in the background.

---

# 39. Responsive Design

The application should work on:

* Desktop
* Laptop
* Tablet
* Mobile

On smaller screens:

* Form sections stack vertically
* Resume preview remains readable
* ATS results stack properly
* Upload interface adapts to the screen
* No horizontal scrolling

---

# 40. Design Philosophy

The application follows a clean and professional SaaS-style design.

### Design principles

* Simple
* Professional
* Modern
* Easy to understand
* Minimal
* ATS-friendly

The UI uses:

* White cards
* Light gray background
* Dark text
* Professional blue accent
* Subtle borders
* Moderate shadows
* Clean icons
* Good spacing

Avoid:

* Excessive gradients
* Glassmorphism
* 3D elements
* Gaming-style UI
* Excessive animations
* Unnecessary graphics

---

# 41. Technology Stack

The project is intentionally frontend-only.

### Technologies

* HTML5
* CSS3
* Vanilla JavaScript
* localStorage
* Client-side file processing
* Client-side resume analysis
* Client-side image generation/download

Possible supporting libraries:

* PDF.js
* Mammoth.js
* html2canvas
* Font Awesome or Lucide

No server is required for the basic application.

---

# 42. No Backend

This MVP does not use:

* Node.js
* Express.js
* MongoDB
* MySQL
* Firebase
* Supabase
* Authentication
* Login
* Signup
* Server APIs

Everything currently works on the client side.

---

# 43. Project Structure

```text
resume-builder/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### index.html

Contains the main HTML structure and external CDN/library references.

### style.css

Contains all styling:

* Navbar
* Forms
* Buttons
* Resume preview
* ATS interface
* Upload interface
* Responsive design
* Download layout

### script.js

Contains:

* Resume data
* Form handling
* Dynamic sections
* Live preview
* localStorage
* Validation
* ATS analysis
* File handling
* Keyword analysis
* Score calculation
* Resume download

### README.md

Contains project documentation.

---

# 44. How to Run

Because this is a frontend project, there is no complicated installation process.

### Method 1

Open:

```text
index.html
```

directly in a modern browser.

### Method 2

Use a local development server such as VS Code Live Server.

Then open the provided local address in the browser.

---

# 45. How to Create a Resume

### Step 1

Open the application.

### Step 2

Select the appropriate resume level:

* Fresher / Beginner
* Internship Ready
* Placement Ready
* Experienced

### Step 3

Enter personal information.

### Step 4

Write your professional summary.

### Step 5

Add skills.

### Step 6

Add experience if available.

### Step 7

Add projects.

### Step 8

Add education.

### Step 9

Add certifications.

### Step 10

Add achievements, activities and languages if applicable.

### Step 11

Review the live preview.

### Step 12

Click:

**Check ATS Score**

### Step 13

Read the problems and recommendations.

### Step 14

Improve the resume.

### Step 15

Click:

**Recheck ATS Score**

### Step 16

Review the final resume.

### Step 17

Download as:

**PNG or JPG**

---

# 46. How to Check an Existing Resume

If the resume was created somewhere else:

### Step 1

Open:

**Check ATS Score**

### Step 2

Select:

**Upload Resume**

### Step 3

Upload:

* PDF
* DOCX
* TXT

### Step 4

Click:

**Analyze Resume**

### Step 5

Wait for the content analysis.

### Step 6

Review:

* ATS score
* Score breakdown
* Strengths
* Problems
* Keywords
* Improvements
* ATS tips

This means users can use the ATS Checker without using the Resume Builder.

---

# 47. Example ATS Result

A result may look like:

```text
ATS Readiness Score

78/100

GOOD
```

Then:

```text
Score Breakdown

Contact Information      9/10
Professional Summary     7/10
Skills & Keywords       12/15
Experience              10/15
Projects                13/15
Education               10/10
Certifications           4/5
Achievements             3/5
Completeness              4/5
ATS Structure             6/10
```

Then:

```text
Strengths

✓ Strong skills section
✓ Multiple projects
✓ Complete education
✓ Relevant keywords
```

Then:

```text
Problems Found

Important:
Project descriptions are too short.

Why:
Recruiters and ATS systems need enough context.

How to improve:
Add technologies, your contribution and measurable results.
```

---

# 48. Privacy

The current application is designed as a client-side application.

Resume information is processed in the browser.

There is no project backend storing user resumes.

The application does not require an account.

Uploaded files should not be permanently stored by the application.

This makes the MVP simple and privacy-friendly.

---

# 49. Current Limitations

Because the project is frontend-only, there are some limitations.

### ATS Score

The score is an estimate.

It cannot reproduce the exact private scoring logic of every ATS used by employers.

### Uploaded Resume Parsing

Some PDFs or DOCX files may have unusual structures that make text extraction difficult.

For example:

* Scanned PDFs
* Image-based resumes
* Highly complicated layouts
* Text converted into images

In such cases, the application may not be able to extract all content correctly.

### Job-Specific Matching

The current version does not provide a full Job Description matching system.

A future version can compare a resume against a specific job description.

---

# 50. Future Improvements

## Phase 2

Possible future features:

* Multiple resume templates
* More professional layouts
* AI-generated professional summaries
* AI project description improvement
* AI resume rewriting
* Job Description Matcher
* Job-specific keyword analysis
* Missing skills suggestions
* Advanced ATS analysis
* Better PDF/DOCX parsing
* More export formats

---

# 51. Phase 3

Possible advanced features:

* User accounts
* Login/Signup
* Backend
* Database
* Multiple saved resumes
* Resume history
* Dashboard
* Cloud storage
* Premium templates
* Payment system
* Admin dashboard
* Advanced AI resume assistant

These features are intentionally not part of the current MVP.

---

# 52. Project Vision

The long-term goal of this project is to create a complete platform where a user can manage the entire resume preparation process.

The ideal workflow is:

```text
Create Resume
      ↓
Review Resume
      ↓
Check ATS Readiness
      ↓
Find Problems
      ↓
Improve Resume
      ↓
Check Again
      ↓
Match With Job Description
      ↓
Improve For Specific Job
      ↓
Download
      ↓
Apply
```

The current version focuses on the first important part of this vision:

**Professional Resume Creation + Independent ATS Readiness Analysis**

---

# 53. Important Note

An ATS score should never be treated as a guarantee of getting an interview or job.

A strong resume score can indicate that the resume follows many good practices, but hiring decisions also depend on:

* Job requirements
* Candidate experience
* Skills
* Interview performance
* Company requirements
* Competition
* Recruiter decisions

The purpose of this tool is to help users **identify resume problems and improve their resume quality**.

---

# 54. Final Summary

The Universal Resume Builder & ATS Resume Checker provides a simple workflow for creating and improving resumes.

### Resume Builder

Create a professional resume from scratch.

### Live Preview

See changes immediately.

### Auto Save

Resume information is automatically saved locally.

### Independent ATS Checker

Upload a resume created anywhere and analyse it.

### Estimated ATS Score

Get a dynamic score from 0–100.

### Detailed Analysis

Understand:

* What is good
* What is missing
* What is weak
* What should be improved
* How to improve it

### Resume Improvement

Fix the detected problems and run the analysis again.

### Download

Download the final resume as PNG or JPG.

---

## Built With

**HTML5 • CSS3 • Vanilla JavaScript • localStorage • Client-Side Processing**

A simple idea:

> **Build better resumes. Understand your weaknesses. Improve before you apply.**

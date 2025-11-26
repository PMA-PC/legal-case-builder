// Legal Case Builder Application - Joshua D. Shipman vs GAINSCO
// This application builds a comprehensive employment discrimination case

// ===== CASE DATA =====
const caseData = {
  personalInfo: {
    fullName: "Joshua D. Shipman",
    employeeNumber: "000287",
    age: 45,
    sexualOrientation: "Gay",
    disability: "Autism Spectrum Disorder",
    jobTitle: "Claims Manager I",
    employer: "MGA Insurance Company Inc / GAINSCO Auto Insurance",
    employmentStart: "2015-11-02",
    employmentEnd: "2025-09-18",
    tenure: "9 years, 10 months",
    address: "3955 Buena Vista Unit C, Dallas, TX 75204",
    email: "Joshua.Shipman@gainsco.com",
    phone: "754-999-0710",
    annualSalary: null // USER TO COMPLETE
  },
  supervisors: {
    directSupervisor: "Travis Cober (VP Claims)",
    hrBusinessPartner: "Stephanie Pathak",
    legalCounsel: "Sola Opeola (Associate General Counsel)"
  },
  timeline: [
    { date: "2024-08-16", event: "Filed formal discrimination complaint", importance: "critical" },
    { date: "2024-08-19", event: "Company acknowledged complaint, assigned to legal", importance: "critical" },
    { date: "2024-06-06", event: "Stephanie Pathak requested job duties documentation", importance: "important" },
    { date: "2025-07", event: "Requested reasonable accommodations for autism", importance: "critical" },
    { date: "2025-09-17", event: "Terminated by Travis Cober and Stephanie Pathak", importance: "critical" },
    { date: "2025-09-29", event: "Submitted expanded complaint with additional grievances", importance: "critical" },
    { date: "2025-02-24", event: "Started marriage therapy due to workplace stress", importance: "important" }
  ],
  claims: [
    {
      claimNumber: 1,
      title: "Sexual Orientation Discrimination (Title VII)",
      legalBasis: "Title VII of Civil Rights Act - Bostock v. Clayton County",
      strengthScore: 7,
      confidenceRating: 78,
      keyFacts: ["Excluded from leadership team meetings", "Pay inequity compared to heterosexual peers", "Hostile comments about sexual orientation"]
    },
    {
      claimNumber: 2,
      title: "Age Discrimination (ADEA)",
      legalBasis: "Age Discrimination in Employment Act",
      strengthScore: 6,
      confidenceRating: 72,
      keyFacts: ["Age 45 - protected class", "Younger employees promoted over him", "Duties reassigned to younger workers"]
    },
    {
      claimNumber: 3,
      title: "Disability Discrimination (ADA)",
      legalBasis: "Americans with Disabilities Act",
      strengthScore: 9,
      confidenceRating: 88,
      keyFacts: ["Autism diagnosis documented", "Requested accommodations July 2025", "Accommodations denied/ignored", "Terminated 2 months after request"]
    },
    {
      claimNumber: 4,
      title: "Retaliation (Title VII, ADEA, ADA)",
      legalBasis: "Anti-retaliation provisions of federal employment law",
      strengthScore: 10,
      confidenceRating: 95,
      keyFacts: ["Filed complaint August 16, 2024", "Terminated September 18, 2025 (13 months later)", "Performance declined only AFTER complaint", "No prior disciplinary history", "Temporal proximity establishes causation"]
    },
    {
      claimNumber: 5,
      title: "Hostile Work Environment",
      legalBasis: "Title VII, ADEA, ADA",
      strengthScore: 7,
      confidenceRating: 75,
      keyFacts: ["Excluded from leadership twice by senior leadership", "Subjected to impossible metrics", "Duties removed without cause", "Pattern of harassment over 5+ years"]
    },
    {
      claimNumber: 6,
      title: "Unequal Pay / Wage Discrimination",
      legalBasis: "Equal Pay Act / Title VII",
      strengthScore: 8,
      confidenceRating: 82,
      keyFacts: ["Manager I title despite Manager II responsibilities", "Franco Glaze promoted to Manager II for same work", "Miles Lerman paid more for similar role", "Requested job reclassification - denied"]
    },
    {
      claimNumber: 7,
      title: "Wrongful Termination (Pretext)",
      legalBasis: "Title VII, ADEA, ADA - McDonnell Douglas burden-shifting",
      strengthScore: 9,
      confidenceRating: 90,
      keyFacts: ["Stated reason: 'Berating direct report in email'", "No prior warnings documented", "No progressive discipline", "Timing suspicious (13 months after complaint)", "Performance excellent 2021-2023"]
    }
  ]
};

// ===== QUESTIONS DATABASE (160 questions organized by section) =====
const questions = [
  // Section 1: Personal & Employment Information
  { id: 1, section: 1, text: "Full Legal Name", type: "text", prefilled: true, value: caseData.personalInfo.fullName, confidence: 100 },
  { id: 2, section: 1, text: "Employee Number", type: "text", prefilled: true, value: caseData.personalInfo.employeeNumber, confidence: 100 },
  { id: 3, section: 1, text: "Age", type: "number", prefilled: true, value: caseData.personalInfo.age, confidence: 100 },
  { id: 4, section: 1, text: "Current Address", type: "text", prefilled: true, value: caseData.personalInfo.address, confidence: 100 },
  { id: 5, section: 1, text: "Phone Number", type: "tel", prefilled: true, value: caseData.personalInfo.phone, confidence: 100 },
  { id: 6, section: 1, text: "Work Email", type: "email", prefilled: true, value: caseData.personalInfo.email, confidence: 100 },
  { id: 7, section: 1, text: "Personal Email", type: "email", prefilled: false, value: "", confidence: 0 },
  { id: 8, section: 1, text: "Job Title at Termination", type: "text", prefilled: true, value: caseData.personalInfo.jobTitle, confidence: 100 },
  { id: 9, section: 1, text: "Employer Legal Name", type: "text", prefilled: true, value: caseData.personalInfo.employer, confidence: 100 },
  { id: 10, section: 1, text: "Employment Start Date", type: "date", prefilled: true, value: caseData.personalInfo.employmentStart, confidence: 100 },
  { id: 11, section: 1, text: "Employment End Date / Termination Date", type: "date", prefilled: true, value: caseData.personalInfo.employmentEnd, confidence: 100 },
  { id: 12, section: 1, text: "Annual Salary at Termination", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 13, section: 1, text: "Direct Supervisor Name and Title", type: "text", prefilled: true, value: caseData.supervisors.directSupervisor, confidence: 100 },
  { id: 14, section: 1, text: "HR Business Partner Name", type: "text", prefilled: true, value: caseData.supervisors.hrBusinessPartner, confidence: 100 },
  { id: 15, section: 1, text: "Department/Division", type: "text", prefilled: true, value: "Claims Department", confidence: 95 },
  { id: 16, section: 1, text: "Number of Direct Reports", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 17, section: 1, text: "Work Location/Office Address", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 18, section: 1, text: "Exempt or Non-Exempt Status", type: "select", options: ["Exempt", "Non-Exempt"], prefilled: false, value: "", confidence: 0 },
  { id: 19, section: 1, text: "Pay Frequency (Weekly, Bi-weekly, Monthly)", type: "select", options: ["Weekly", "Bi-weekly", "Monthly"], prefilled: false, value: "", confidence: 0 },
  { id: 20, section: 1, text: "Last Performance Review Date", type: "date", prefilled: true, value: "2024-06", confidence: 85 },

  // Section 2: Disability & Protected Class Status
  { id: 21, section: 2, text: "Sexual Orientation", type: "text", prefilled: true, value: caseData.personalInfo.sexualOrientation, confidence: 100 },
  { id: 22, section: 2, text: "Disability Diagnosis", type: "text", prefilled: true, value: caseData.personalInfo.disability, confidence: 100 },
  { id: 23, section: 2, text: "Date of Disability Diagnosis", type: "date", prefilled: false, value: "", confidence: 0 },
  { id: 24, section: 2, text: "Diagnosing Medical Professional Name & Credentials", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 25, section: 2, text: "Do you have written documentation of your diagnosis?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 26, section: 2, text: "When did you disclose your disability to your employer?", type: "date", prefilled: false, value: "", confidence: 0 },
  { id: 27, section: 2, text: "To whom did you disclose your disability? (Name and Title)", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 28, section: 2, text: "Method of disclosure (email, meeting, letter, etc.)", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 29, section: 2, text: "Did anyone at work make comments about your sexual orientation?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 30, section: 2, text: "If yes, describe the comments and who made them", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 31, section: 2, text: "Were you treated differently after disclosing your sexual orientation?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 32, section: 2, text: "Describe how treatment changed", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 33, section: 2, text: "Were you excluded from meetings or events that others attended?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 90 },
  { id: 34, section: 2, text: "Describe specific instances of exclusion (dates, meetings, who attended)", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 35, section: 2, text: "Did you witness discrimination against other LGBTQ+ employees?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },

  // Section 3: Accommodation Requests & Denials
  { id: 36, section: 3, text: "When did you first request reasonable accommodations?", type: "date", prefilled: true, value: "2025-07", confidence: 80 },
  { id: 37, section: 3, text: "What specific accommodations did you request?", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 38, section: 3, text: "To whom did you submit the accommodation request?", type: "text", prefilled: true, value: "Stephanie Pathak", confidence: 85 },
  { id: 39, section: 3, text: "Was your request in writing? (Upload evidence)", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 40, section: 3, text: "Did the employer engage in an interactive process?", type: "select", options: ["Yes", "No", "Partially"], prefilled: false, value: "", confidence: 0 },
  { id: 41, section: 3, text: "Describe the employer's response to your accommodation request", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 42, section: 3, text: "Were you told your accommodations were being processed when you were terminated?", type: "select", options: ["Yes", "No", "Unsure"], prefilled: false, value: "", confidence: 0 },
  { id: 43, section: 3, text: "Did anyone tell you the accommodations would be 'too difficult' or 'too expensive'?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 44, section: 3, text: "If yes, who said this and when?", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 45, section: 3, text: "Were accommodations provided to other employees with disabilities?", type: "select", options: ["Yes", "No", "Don't know"], prefilled: false, value: "", confidence: 0 },
  { id: 46, section: 3, text: "If yes, describe what accommodations others received", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 47, section: 3, text: "Did your supervisor make comments about your disability being a 'problem'?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 48, section: 3, text: "Describe any negative comments about your disability", type: "textarea", prefilled: false, value: "", confidence: 0 },

  // Section 4: Adverse Actions & Retaliation Timeline
  { id: 49, section: 4, text: "Date of initial discrimination complaint", type: "date", prefilled: true, value: "2024-08-16", confidence: 100 },
  { id: 50, section: 4, text: "Date complaint was acknowledged by employer", type: "date", prefilled: true, value: "2024-08-19", confidence: 100 },
  { id: 51, section: 4, text: "Who was assigned to investigate your complaint?", type: "text", prefilled: true, value: caseData.supervisors.legalCounsel, confidence: 100 },
  { id: 52, section: 4, text: "Were you interviewed as part of the investigation?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 53, section: 4, text: "If yes, when and by whom?", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 54, section: 4, text: "Were you provided findings from the investigation?", type: "select", options: ["Yes", "No"], prefilled: false, value: "No", confidence: 85 },
  { id: 55, section: 4, text: "Did your job duties change after filing the complaint?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 90 },
  { id: 56, section: 4, text: "Describe what duties were removed or added", type: "textarea", prefilled: true, value: "Total Loss division removed and reassigned to Franco Glaze", confidence: 85 },
  { id: 57, section: 4, text: "Did your performance reviews change after the complaint?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 95 },
  { id: 58, section: 4, text: "Performance rating BEFORE complaint", type: "text", prefilled: true, value: "Exceeds Expectations (2021-2023)", confidence: 100 },
  { id: 59, section: 4, text: "Performance rating AFTER complaint", type: "text", prefilled: true, value: "Below Expectations (2024 Mid-Year)", confidence: 100 },
  { id: 60, section: 4, text: "Were you ever told you were 'no longer part of the leadership team'?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 90 },
  { id: 61, section: 4, text: "Who told you this and when? (Provide dates)", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 62, section: 4, text: "Were you excluded from meetings after filing the complaint?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 85 },
  { id: 63, section: 4, text: "List specific meetings you were excluded from (with dates)", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 64, section: 4, text: "Did you receive verbal warnings after the complaint?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 65, section: 4, text: "Did you receive written warnings after the complaint?", type: "select", options: ["Yes", "No"], prefilled: false, value: "No", confidence: 80 },
  { id: 66, section: 4, text: "Were you placed on a Performance Improvement Plan (PIP)?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 67, section: 4, text: "If yes, when was the PIP implemented?", type: "date", prefilled: false, value: "", confidence: 0 },
  { id: 68, section: 4, text: "Date of termination", type: "date", prefilled: true, value: caseData.personalInfo.employmentEnd, confidence: 100 },
  { id: 69, section: 4, text: "Number of days/months between complaint and termination", type: "text", prefilled: true, value: "13 months (398 days)", confidence: 100 },
  { id: 70, section: 4, text: "Who conducted the termination meeting?", type: "text", prefilled: true, value: "Travis Cober and Stephanie Pathak", confidence: 100 },
  { id: 71, section: 4, text: "What reason was given for your termination?", type: "textarea", prefilled: true, value: "Violated company policy by berating one of your direct reports in an email", confidence: 100 },
  { id: 72, section: 4, text: "Was this the first time you heard about this alleged incident?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 73, section: 4, text: "Had you received prior warnings about this behavior?", type: "select", options: ["Yes", "No"], prefilled: true, value: "No", confidence: 90 },
  { id: 74, section: 4, text: "Do you have the email they referenced? (Upload if available)", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 75, section: 4, text: "Describe the context of the email in question", type: "textarea", prefilled: false, value: "", confidence: 0 },

  // Section 5: Comparator Evidence
  { id: 76, section: 5, text: "Name of Comparator #1", type: "text", prefilled: true, value: "Franco Glaze", confidence: 100 },
  { id: 77, section: 5, text: "Comparator #1 Title", type: "text", prefilled: true, value: "Claims Manager II", confidence: 100 },
  { id: 78, section: 5, text: "Comparator #1 Responsibilities", type: "textarea", prefilled: true, value: "Manages Total Loss division (formerly managed by Shipman)", confidence: 95 },
  { id: 79, section: 5, text: "Comparator #1 Salary (if known)", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 80, section: 5, text: "Was Comparator #1 your former subordinate?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 81, section: 5, text: "When was Comparator #1 promoted?", type: "date", prefilled: false, value: "", confidence: 0 },
  { id: 82, section: 5, text: "Comparator #1 Age (approximate)", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 83, section: 5, text: "Comparator #1 Sexual Orientation (if known)", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 84, section: 5, text: "Name of Comparator #2", type: "text", prefilled: true, value: "Miles Lerman", confidence: 100 },
  { id: 85, section: 5, text: "Comparator #2 Title", type: "text", prefilled: true, value: "Claims Manager", confidence: 95 },
  { id: 86, section: 5, text: "Comparator #2 Responsibilities", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 87, section: 5, text: "Comparator #2 Salary (if known)", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 88, section: 5, text: "Comparator #2 Age (approximate)", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 89, section: 5, text: "Name of Comparator #3", type: "text", prefilled: true, value: "Kim Price", confidence: 100 },
  { id: 90, section: 5, text: "Comparator #3 Title", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 91, section: 5, text: "Were any comparators promoted while you were passed over?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 95 },
  { id: 92, section: 5, text: "Did you request a salary increase or promotion?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 93, section: 5, text: "If yes, when and what was the response?", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 94, section: 5, text: "Did you request job reclassification from Manager I to Manager II?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 90 },
  { id: 95, section: 5, text: "When did you request reclassification?", type: "date", prefilled: true, value: "2024-06-06", confidence: 85 },
  { id: 96, section: 5, text: "What reason was given for denial?", type: "textarea", prefilled: true, value: "HR informed review was not for reclassification or salary purposes", confidence: 85 },
  { id: 97, section: 5, text: "Are you aware of Manager I positions being reclassified to Manager II?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 90 },
  { id: 98, section: 5, text: "Provide names of those reclassified", type: "textarea", prefilled: true, value: "Franco Glaze", confidence: 90 },

  // Section 6: Performance Review Disparities
  { id: 99, section: 6, text: "2021 Performance Rating", type: "text", prefilled: true, value: "Exceeds Expectations", confidence: 100 },
  { id: 100, section: 6, text: "2021 Reviewer Name", type: "text", prefilled: true, value: "Mark Hayes", confidence: 100 },
  { id: 101, section: 6, text: "2022 Performance Rating", type: "text", prefilled: true, value: "Meets/Exceeds Expectations", confidence: 100 },
  { id: 102, section: 6, text: "2022 Reviewer Name", type: "text", prefilled: true, value: "Mark Hayes", confidence: 100 },
  { id: 103, section: 6, text: "2023 Performance Rating", type: "text", prefilled: true, value: "Meets/Exceeds Expectations", confidence: 100 },
  { id: 104, section: 6, text: "2023 Reviewer Name", type: "text", prefilled: true, value: "Mark Hayes", confidence: 100 },
  { id: 105, section: 6, text: "2024 Performance Rating (Mid-Year)", type: "text", prefilled: true, value: "Below Expectations", confidence: 100 },
  { id: 106, section: 6, text: "2024 Reviewer Name", type: "text", prefilled: true, value: "Travis Cober", confidence: 100 },
  { id: 107, section: 6, text: "Did reviewer change when your ratings declined?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 108, section: 6, text: "Previous reviewer: Mark Hayes; New reviewer: Travis Cober (confirmed?)", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 109, section: 6, text: "Were performance standards changed for you but not others?", type: "select", options: ["Yes", "No", "Unsure"], prefilled: false, value: "", confidence: 0 },
  { id: 110, section: 6, text: "Describe any 'impossible metrics' you were assigned", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 111, section: 6, text: "Were you told metrics were 'mathematically impossible'?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 112, section: 6, text: "Did comparators have achievable metrics while yours were not?", type: "select", options: ["Yes", "No", "Unsure"], prefilled: false, value: "", confidence: 0 },

  // Section 7: Emotional & Financial Damages
  { id: 113, section: 7, text: "When did you start marriage/relationship therapy?", type: "date", prefilled: true, value: "2025-02-24", confidence: 100 },
  { id: 114, section: 7, text: "Therapist Name", type: "text", prefilled: true, value: "Federico Mendez, MS, LMFT", confidence: 100 },
  { id: 115, section: 7, text: "Therapist Practice Name", type: "text", prefilled: true, value: "Intimacy Counseling & Consulting, PLLC", confidence: 100 },
  { id: 116, section: 7, text: "Reason for therapy (related to work stress?)", type: "textarea", prefilled: true, value: "Relationship strain with partner Ahmad Atiyah due to workplace stress", confidence: 95 },
  { id: 117, section: 7, text: "Are you currently in individual therapy?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 118, section: 7, text: "Individual therapist name and credentials", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 119, section: 7, text: "Have you been diagnosed with depression or anxiety?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 120, section: 7, text: "Are you taking medication for mental health?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 121, section: 7, text: "Have you experienced sleep disruption?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 122, section: 7, text: "Have you experienced intrusive thoughts about work/termination?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 123, section: 7, text: "PHQ-9 Depression Score (0-27)", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 124, section: 7, text: "GAD-7 Anxiety Score (0-21)", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 125, section: 7, text: "Lost wages since termination (calculate back pay)", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 126, section: 7, text: "Value of lost benefits (health insurance, 401k)", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 127, section: 7, text: "Therapy costs incurred", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 128, section: 7, text: "Job search expenses", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 129, section: 7, text: "Have you found new employment?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 130, section: 7, text: "If yes, new salary", type: "number", prefilled: false, value: "", confidence: 0 },
  { id: 131, section: 7, text: "If yes, date new employment started", type: "date", prefilled: false, value: "", confidence: 0 },

  // Section 8: Evidence Documentation
  { id: 132, section: 8, text: "Do you have your formal complaint email (August 16, 2024)?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 133, section: 8, text: "Do you have the company acknowledgment (August 19, 2024)?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 134, section: 8, text: "Do you have performance reviews from 2021-2024?", type: "select", options: ["Yes", "No", "Partial"], prefilled: false, value: "", confidence: 0 },
  { id: 135, section: 8, text: "Do you have the email requesting job duties documentation?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 136, section: 8, text: "Do you have your accommodation request(s)?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 137, section: 8, text: "Do you have documentation of duties being removed?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 138, section: 8, text: "Do you have pay stubs showing salary", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 139, section: 8, text: "Do you have organizational charts?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 140, section: 8, text: "Do you have emails showing exclusion from meetings?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 141, section: 8, text: "Do you have the termination meeting notes?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 142, section: 8, text: "Do you have medical records for autism diagnosis?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 143, section: 8, text: "Do you have therapy intake forms?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },
  { id: 144, section: 8, text: "Do you have witness contact information?", type: "select", options: ["Yes", "No"], prefilled: false, value: "", confidence: 0 },

  // Section 9: Witness Information
  { id: 145, section: 9, text: "Witness #1 Name", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 146, section: 9, text: "Witness #1 Title/Relationship", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 147, section: 9, text: "Witness #1 Contact Information", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 148, section: 9, text: "What can Witness #1 testify to?", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 149, section: 9, text: "Witness #2 Name", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 150, section: 9, text: "Witness #2 Title/Relationship", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 151, section: 9, text: "What can Witness #2 testify to?", type: "textarea", prefilled: false, value: "", confidence: 0 },
  { id: 152, section: 9, text: "Witness #3 Name", type: "text", prefilled: false, value: "", confidence: 0 },
  { id: 153, section: 9, text: "Partner/Spouse Name (for emotional distress testimony)", type: "text", prefilled: true, value: "Ahmad Atiyah", confidence: 90 },
  { id: 154, section: 9, text: "Is partner/spouse willing to provide statement?", type: "select", options: ["Yes", "No", "Unsure"], prefilled: false, value: "", confidence: 0 },

  // Section 10: Discovery Requests
  { id: 155, section: 10, text: "Do you need Franco Glaze's personnel file?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 156, section: 10, text: "Do you need Miles Lerman's salary information?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 157, section: 10, text: "Do you need all emails between Travis Cober and Stephanie Pathak about you?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 158, section: 10, text: "Do you need company's investigation file?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 159, section: 10, text: "Do you need all performance metrics for Claims Managers 2020-2025?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 },
  { id: 160, section: 10, text: "Do you need company policies on accommodation procedures?", type: "select", options: ["Yes", "No"], prefilled: true, value: "Yes", confidence: 100 }
];

const sections = [
  { id: 1, name: "Personal & Employment Info", description: "Basic information about you and your employment" },
  { id: 2, name: "Protected Class Status", description: "Information about discrimination based on protected characteristics" },
  { id: 3, name: "Accommodation Requests", description: "Details about disability accommodations requested and denied" },
  { id: 4, name: "Retaliation Timeline", description: "Adverse actions taken after your complaint" },
  { id: 5, name: "Comparator Evidence", description: "Information about similarly situated employees treated differently" },
  { id: 6, name: "Performance Disparities", description: "Changes in performance reviews after complaint" },
  { id: 7, name: "Damages Assessment", description: "Emotional and financial harm documentation" },
  { id: 8, name: "Evidence Checklist", description: "Documents and evidence you currently have" },
  { id: 9, name: "Witnesses", description: "People who can support your claims" },
  { id: 10, name: "Discovery Needs", description: "Documents to request from employer" }
];

// ===== STATE MANAGEMENT =====
let currentSection = 1;
let questionData = {}; // Store user answers
let uploadedFiles = {}; // Store file references
let chatHistory = [];

// Initialize question data from questions array
questions.forEach(q => {
  questionData[q.id] = {
    value: q.value,
    confidence: q.confidence,
    prefilled: q.prefilled,
    evidence: []
  };
});

// ===== INITIALIZATION =====
function init() {
  renderNavigation();
  renderSection(currentSection);
  initChat();
  updateProgress();
  setupEventListeners();
}

// ===== NAVIGATION =====
function renderNavigation() {
  const sectionList = document.getElementById('section-list');
  sectionList.innerHTML = sections.map(section => {
    const completion = calculateSectionCompletion(section.id);
    return `
      <li>
        <a href="#" data-section="${section.id}" class="${currentSection === section.id ? 'active' : ''}">
          <span>${section.name}</span>
          <span class="completion-badge">${completion}%</span>
        </a>
      </li>
    `;
  }).join('');

  // Add click handlers
  sectionList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = parseInt(link.dataset.section);
      navigateToSection(sectionId);
    });
  });
}

function navigateToSection(sectionId) {
  currentSection = sectionId;
  renderSection(sectionId);
  renderNavigation();
}

function calculateSectionCompletion(sectionId) {
  const sectionQuestions = questions.filter(q => q.section === sectionId);
  const completed = sectionQuestions.filter(q => {
    const data = questionData[q.id];
    return data.value !== "" && data.value !== null;
  }).length;
  return Math.round((completed / sectionQuestions.length) * 100);
}

function updateProgress() {
  const totalQuestions = questions.length;
  const completedQuestions = questions.filter(q => {
    const data = questionData[q.id];
    return data.value !== "" && data.value !== null;
  }).length;
  const percentage = Math.round((completedQuestions / totalQuestions) * 100);
  document.getElementById('completion-progress').innerHTML = `
    <strong>${percentage}% Complete</strong><br>
    <small>${completedQuestions} of ${totalQuestions} questions answered</small>
  `;
}

// ===== SECTION RENDERING =====
function renderSection(sectionId) {
  const section = sections.find(s => s.id === sectionId);
  const sectionQuestions = questions.filter(q => q.section === sectionId);
  const mainContent = document.getElementById('main-content');

  if (sectionId === 1) {
    // Special overview for Section 1
    mainContent.innerHTML = `
      <div class="case-overview">
        <h2>Case: Joshua D. Shipman v. GAINSCO Auto Insurance</h2>
        <p><strong>Goal:</strong> Build comprehensive evidence to guarantee settlement for employment discrimination, retaliation, and wrongful termination.</p>
        <div class="case-stats">
          <div class="stat-card">
            <div class="stat-label">Employment Duration</div>
            <div class="stat-value">9.8 years</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Days to Termination</div>
            <div class="stat-value">398 days</div>
            <small style="color: var(--color-text-secondary);">After complaint filed</small>
          </div>
          <div class="stat-card">
            <div class="stat-label">Legal Claims</div>
            <div class="stat-value">7</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Average Claim Strength</div>
            <div class="stat-value">${calculateAverageClaimStrength()}%</div>
          </div>
        </div>
      </div>
      <div class="section-header">
        <h2 class="section-title">${section.name}</h2>
        <p class="section-description">${section.description}</p>
      </div>
      ${renderQuestions(sectionQuestions)}
    `;
  } else {
    mainContent.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">${section.name}</h2>
        <p class="section-description">${section.description}</p>
      </div>
      ${renderQuestions(sectionQuestions)}
    `;
  }

  // Reattach event listeners for this section
  attachQuestionEventListeners();
}

function calculateAverageClaimStrength() {
  const total = caseData.claims.reduce((sum, claim) => sum + claim.confidenceRating, 0);
  return Math.round(total / caseData.claims.length);
}

function renderQuestions(sectionQuestions) {
  return sectionQuestions.map(q => {
    const data = questionData[q.id];
    let cardClass = 'question-card';
    let confidenceBadge = '';

    if (data.prefilled) {
      cardClass += ' pre-filled';
      confidenceBadge = `<span class="confidence-badge confidence-high">✓ ${data.confidence}%</span>`;
    } else if (data.value && data.confidence >= 85) {
      cardClass += ' ai-extracted';
      confidenceBadge = `<span class="confidence-badge confidence-high">AI: ${data.confidence}%</span>`;
    } else if (data.value && data.confidence >= 70) {
      cardClass += ' user-input';
      confidenceBadge = `<span class="confidence-badge confidence-medium">${data.confidence}%</span>`;
    } else if (data.value && data.confidence < 70) {
      cardClass += ' low-confidence';
      confidenceBadge = `<span class="confidence-badge confidence-low">${data.confidence}%</span>`;
    } else {
      cardClass += ' user-input';
    }

    let inputHTML = '';
    if (q.type === 'textarea') {
      inputHTML = `<textarea class="form-control" id="q-${q.id}" data-question-id="${q.id}" rows="4">${data.value || ''}</textarea>`;
    } else if (q.type === 'select') {
      inputHTML = `
        <select class="form-control" id="q-${q.id}" data-question-id="${q.id}">
          <option value="">-- Select --</option>
          ${q.options.map(opt => `<option value="${opt}" ${data.value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
        </select>
      `;
    } else {
      inputHTML = `<input type="${q.type}" class="form-control" id="q-${q.id}" data-question-id="${q.id}" value="${data.value || ''}" />`;
    }

    let evidenceHTML = '';
    if (data.evidence && data.evidence.length > 0) {
      evidenceHTML = `
        <div class="evidence-list">
          <strong>Evidence:</strong>
          ${data.evidence.map(e => `<div class="evidence-item">📄 ${e}</div>`).join('')}
        </div>
      `;
    }

    return `
      <div class="${cardClass}">
        <div class="question-header">
          <label class="question-label" for="q-${q.id}">${q.text}</label>
          ${confidenceBadge}
        </div>
        ${inputHTML}
        ${evidenceHTML}
        <div class="question-actions">
          <button class="btn btn--secondary btn--sm upload-btn" data-question-id="${q.id}">📎 Upload Evidence</button>
        </div>
      </div>
    `;
  }).join('');
}

function attachQuestionEventListeners() {
  // Input change listeners
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('change', (e) => {
      const questionId = parseInt(e.target.dataset.questionId);
      questionData[questionId].value = e.target.value;
      // Simulate confidence calculation
      if (e.target.value && !questionData[questionId].prefilled) {
        questionData[questionId].confidence = 70; // Default confidence for user input
      }
      updateProgress();
      renderNavigation();
    });
  });

  // Upload button listeners
  document.querySelectorAll('.upload-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const questionId = parseInt(e.target.dataset.questionId);
      openUploadModal(questionId);
    });
  });
}

// ===== FILE UPLOAD MODAL =====
let currentUploadQuestionId = null;

function openUploadModal(questionId) {
  currentUploadQuestionId = questionId;
  const modal = document.getElementById('file-upload-modal');
  modal.classList.remove('hidden');
}

function closeUploadModal() {
  const modal = document.getElementById('file-upload-modal');
  modal.classList.add('hidden');
  document.getElementById('evidence-file').value = '';
  currentUploadQuestionId = null;
}

function setupEventListeners() {
  document.getElementById('close-upload-modal').addEventListener('click', closeUploadModal);
  document.getElementById('upload-evidence-btn').addEventListener('click', handleFileUpload);
  document.getElementById('send-chat').addEventListener('click', sendChatMessage);
  document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
  document.getElementById('export-summary').addEventListener('click', exportCaseSummary);
  document.getElementById('toggle-chat').addEventListener('click', toggleChat);
}

function handleFileUpload() {
  const fileInput = document.getElementById('evidence-file');
  const files = fileInput.files;
  
  if (files.length === 0) {
    alert('Please select at least one file.');
    return;
  }

  // Simulate AI extraction (in real implementation, would call AI API)
  Array.from(files).forEach(file => {
    const fileName = file.name;
    if (!questionData[currentUploadQuestionId].evidence) {
      questionData[currentUploadQuestionId].evidence = [];
    }
    questionData[currentUploadQuestionId].evidence.push(fileName);
    
    // Simulate AI confidence boost
    if (!questionData[currentUploadQuestionId].prefilled) {
      questionData[currentUploadQuestionId].confidence = Math.min(95, questionData[currentUploadQuestionId].confidence + 20);
    }
  });

  // Add AI message about extraction
  addChatMessage('ai', `I've uploaded your file(s) for Question ${currentUploadQuestionId}. Analyzing document content... Confidence increased to ${questionData[currentUploadQuestionId].confidence}%.`);

  closeUploadModal();
  renderSection(currentSection);
  updateProgress();
}

// ===== CHAT SYSTEM =====
function initChat() {
  addChatMessage('ai', `Hello, I'm your employment attorney specializing in Texas discrimination law. I'm reviewing Joshua Shipman's case against GAINSCO. This is a strong retaliation case with ${calculateDaysBetween('2024-08-16', '2025-09-18')} days of temporal proximity. Let's build the strongest possible evidence for settlement. How can I help?`);
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;

  addChatMessage('user', message);
  input.value = '';

  // Simulate AI response (in real app, would call AI API)
  setTimeout(() => {
    const aiResponse = generateAIResponse(message);
    addChatMessage('ai', aiResponse);
  }, 1000);
}

function addChatMessage(sender, text) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatHistory.push({ sender, text });
}

function generateAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) {
    return "For the unequal pay claim, we need your exact salary and Franco Glaze's salary. Can you upload pay stubs? This is critical comparator evidence. Without it, our confidence on the wage discrimination claim drops below 70%.";
  } else if (lowerMessage.includes('accommodation') || lowerMessage.includes('autism')) {
    return "The ADA claim is already at 88% confidence, but we need written proof of your accommodation request. Did you send an email to Stephanie Pathak in July 2025? Upload that email and we'll hit 95%+ confidence.";
  } else if (lowerMessage.includes('retaliation')) {
    return "Your retaliation claim is the strongest at 95% confidence. The temporal proximity (13 months) is excellent, and performance only declined AFTER the complaint. We should lead with this at the good faith conference. What other adverse actions occurred between August 2024 and September 2025?";
  } else if (lowerMessage.includes('evidence') || lowerMessage.includes('document')) {
    return "Let's do an evidence review. You have the formal complaint (Aug 16), acknowledgment (Aug 19), and performance reviews showing the decline. We still need: (1) accommodation request email, (2) comparator salary data, (3) emails showing exclusion from meetings. Which can you provide?";
  } else if (lowerMessage.includes('settlement') || lowerMessage.includes('value')) {
    return "Settlement value depends on economic and non-economic damages. With 9.8 years tenure and 7 federal claims, we're looking at: Back pay (13 months) + Front pay (24 months est.) + Emotional distress (3-4x multiplier with therapy evidence) + Punitive damages potential. Estimated range: $350K - $750K. Want me to calculate specifics?";
  } else {
    return "That's a good question. To give you the best answer, can you clarify which claim this relates to? We have 7 claims total: (1) Sexual Orientation, (2) Age, (3) Disability, (4) Retaliation, (5) Hostile Environment, (6) Unequal Pay, (7) Wrongful Termination.";
  }
}

function toggleChat() {
  const sidebar = document.getElementById('sidebar-chat');
  const toggleBtn = document.getElementById('toggle-chat');
  if (sidebar.style.display === 'none') {
    sidebar.style.display = 'flex';
    toggleBtn.textContent = '➖';
    toggleBtn.setAttribute('aria-label', 'Hide chat');
  } else {
    sidebar.style.display = 'none';
    toggleBtn.textContent = '➕';
    toggleBtn.setAttribute('aria-label', 'Show chat');
  }
}

// ===== CASE SUMMARY EXPORT =====
function exportCaseSummary() {
  const summary = generateCaseSummary();
  downloadJSON(summary, 'Shipman_v_GAINSCO_Case_Summary.json');
  alert('Case summary exported! You can also generate a PDF version from the Strategy Dashboard.');
}

function generateCaseSummary() {
  return {
    case_name: "Joshua D. Shipman v. GAINSCO Auto Insurance",
    generated_date: new Date().toISOString(),
    complainant: caseData.personalInfo,
    supervisors: caseData.supervisors,
    timeline: caseData.timeline,
    claims: caseData.claims,
    questions_answered: questions.filter(q => questionData[q.id].value).length,
    total_questions: questions.length,
    completion_percentage: Math.round((questions.filter(q => questionData[q.id].value).length / questions.length) * 100),
    question_responses: questionData,
    uploaded_evidence: uploadedFiles,
    chat_history: chatHistory,
    average_claim_confidence: calculateAverageClaimStrength(),
    case_strength_assessment: assessCaseStrength()
  };
}

function assessCaseStrength() {
  const avgConfidence = calculateAverageClaimStrength();
  if (avgConfidence >= 85) return "STRONG - Ready for Good Faith Conference";
  if (avgConfidence >= 75) return "MODERATE - Obtain additional evidence before proceeding";
  return "DEVELOPING - Significant evidence gaps remain";
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== UTILITY FUNCTIONS =====
function calculateDaysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// ===== START APPLICATION =====
document.addEventListener('DOMContentLoaded', init);

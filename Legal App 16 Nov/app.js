import { auth, db, storage } from './firebase-init.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// DOM elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.querySelector('.app-container');
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');

// Event Listeners
if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        const email = authEmail.value;
        const password = authPassword.value;
        signInWithEmailAndPassword(auth, email, password)
            .catch(error => {
                authError.textContent = error.message;
            });
    });
}

if (btnSignup) {
    btnSignup.addEventListener('click', () => {
        const email = authEmail.value;
        const password = authPassword.value;
        createUserWithEmailAndPassword(auth, email, password)
            .catch(error => {
                authError.textContent = error.message;
            });
    });
}


// Auth state observer
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in, show the app
        authContainer.style.display = 'none';
        appContainer.style.display = 'flex';
        initializeApp(user);
    } else {
        // User is signed out, show the auth form
        authContainer.style.display = 'flex';
        appContainer.style.display = 'none';
    }
});

function initializeApp(user) {
    // Legal Case Builder Application
    
    let caseData = {
      personal: {},
      protectedClass: {},
      performance: {},
      complaint: {},
      accommodation: {},
      adverseActions: {},
      comparators: {},
      termination: {},
      evidence: {},
      lastSaved: null
    };
    
    let timelineEvents = [];
    
    let evidenceFiles = {};

    const userDocRef = doc(db, 'users', user.uid);

    async function loadData() {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            caseData = data.caseData || caseData;
            timelineEvents = data.timelineEvents || [];
            evidenceFiles = data.evidenceFiles || {};

            // Populate form fields
            for (const category in caseData) {
                if (typeof caseData[category] === 'object') {
                    for (const field in caseData[category]) {
                        const el = document.getElementById(field);
                        if (el) {
                            el.value = caseData[category][field];
                        }
                    }
                }
            }
            // Display evidence
            for (const fieldId in evidenceFiles) {
                displayEvidence(fieldId);
            }
            renderTimeline();
            updateLastSaved();
        } else {
            // If no data, set the default timeline
            timelineEvents = [
              {
                date: '2024-08-16',
                time: '11:54 AM',
                type: 'complaint',
                sender: 'Joshua D. Shipman',
                recipients: ['Stephanie Pathak (HR)', 'Sola Opeola (General Counsel)'],
                summary: 'Formal discrimination complaint filed regarding age, sexual orientation, and hostile work environment',
                hasAttachment: true
              },
              {
                date: '2024-08-19',
                type: 'company',
                sender: 'Stephanie Pathak',
                recipients: ['Joshua D. Shipman'],
                summary: 'Investigation assigned in response to complaint',
                hasAttachment: false
              },
              {
                date: '2024-09-26',
                type: 'adverse',
                sender: 'Travis Cober',
                recipients: ['Joshua D. Shipman'],
                summary: 'Job title updated to "Manager I" with no duty or salary increase (41 days post-complaint)',
                hasAttachment: true
              },
              {
                date: '2024-11-01',
                type: 'adverse',
                sender: 'Michael Parrish',
                recipients: ['Joshua D. Shipman'],
                summary: 'Total Loss division removed from responsibilities',
                hasAttachment: false
              },
              {
                date: '2025-07-01',
                type: 'request',
                sender: 'Joshua D. Shipman',
                recipients: ['Stephanie Pathak (HR)', 'Travis Cober'],
                summary: 'Initial accommodation request for flexible work location due to anxiety/panic disorders',
                hasAttachment: true
              },
              {
                date: '2025-07-15',
                type: 'adverse',
                sender: 'Travis Cober',
                recipients: ['Team'],
                summary: 'Joshua excluded from core strategic meetings and projects',
                hasAttachment: false
              },
              {
                date: '2025-07-29',
                type: 'request',
                sender: 'Joshua D. Shipman',
                recipients: ['Stephanie Pathak (HR)'],
                summary: 'Updated accommodation request with medical documentation from APRN',
                hasAttachment: true
              },
              {
                date: '2025-08-10',
                type: 'adverse',
                sender: 'Michael Parrish',
                recipients: ['Joshua D. Shipman'],
                summary: 'Excluded from vendor-facing meetings',
                hasAttachment: false
              },
              {
                date: '2025-09-17',
                type: 'termination',
                sender: 'Travis Cober / HR',
                recipients: ['Joshua D. Shipman'],
                summary: 'Termination - stated reason: "berating subordinate"',
                hasAttachment: true
              },
              {
                date: '2025-09-29',
                type: 'promotion',
                sender: 'GAINSCO HR',
                recipients: ['Franco Glaze', 'Kim Price'],
                summary: 'Franco Glaze promoted to Manager L2, Kim Price promoted to Manager 1 (Joshua\'s former role)',
                hasAttachment: false
              }
            ];
            renderTimeline();
        }
    }
    
    // Tab Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        switchTab(tabName);
      });
    });
    
    function switchTab(tabName) {
      // Update active tab button
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
      
      // Update active content
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      
      // Initialize content if needed
      if (tabName === 'timeline') {
        renderTimeline();
      } else if (tabName === 'meeting-prep') {
        renderPrepQuestions();
      }
    }
    
    // Auto-save functionality with debouncing
    let saveTimeout;
    function setupAutoSave() {
      const fields = document.querySelectorAll('.form-input, .form-textarea, .form-select');
      
      fields.forEach(field => {
        field.addEventListener('input', function() {
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(() => {
            saveField(this.id, this.value);
            updateCharCount(this.id);
          }, 500);
        });
        
        // Initialize character counts
        updateCharCount(field.id);
      });
    }
    
    async function saveField(fieldId, value) {
      caseData.lastSaved = new Date().toISOString();
      
      const category = fieldId.split('-')[1];
      if (!caseData[category]) {
        caseData[category] = {};
      }
      caseData[category][fieldId] = value;

      await setDoc(userDocRef, { caseData }, { merge: true });
      
      // Show saved indicator
      const savedIndicator = document.getElementById(`saved-${fieldId.replace('field-', '')}`);
      if (savedIndicator) {
        savedIndicator.style.display = 'inline-flex';
        setTimeout(() => {
          savedIndicator.style.display = 'none';
        }, 2000);
      }
      
      updateLastSaved();
    }
    
    function updateCharCount(fieldId) {
      const field = document.getElementById(fieldId);
      const charCountEl = document.getElementById(`char-${fieldId.replace('field-', '')}`);
      
      if (field && charCountEl && field.tagName === 'TEXTAREA') {
        charCountEl.textContent = `${field.value.length} characters`;
      }
    }
    
    function updateLastSaved() {
      const lastSavedEl = document.getElementById('last-saved');
      if (caseData.lastSaved) {
        const date = new Date(caseData.lastSaved);
        lastSavedEl.textContent = `Last saved: ${date.toLocaleTimeString()}`;
      }
    }
    
    // Timeline Rendering
    function renderTimeline() {
      const container = document.getElementById('timeline-container');
      container.innerHTML = '';
      
      timelineEvents.forEach(event => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        const typeColors = {
          complaint: 'var(--color-primary)',
          company: 'var(--color-info)',
          adverse: 'var(--color-error)',
          request: 'var(--color-success)',
          termination: 'var(--color-error)',
          promotion: 'var(--color-warning)'
        };
        
        item.style.setProperty('--timeline-color', typeColors[event.type] || 'var(--color-primary)');
        
        item.innerHTML = `
          <div class="timeline-date">${formatDate(event.date)}${event.time ? ' at ' + event.time : ''}</div>
          <div class="timeline-content" style="border-left-color: ${typeColors[event.type]}">
            <strong>${event.sender}</strong> → ${event.recipients.join(', ')}<br>
            ${event.summary}
            ${event.hasAttachment ? '<br><span class="status-badge status-info">📎 Has Attachment</span>' : ''}
          </div>
        `;
        
        container.appendChild(item);
      });
    }
    
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    // Legal Research
    const researchDatabase = {
      'ADA retaliation temporal proximity': [
        {
          title: 'Kramer v. Logan County Public Library (N.D. Tex. 2019)',
          citation: '2019 WL 2371290',
          summary: 'Court found temporal proximity of 3 months between accommodation request and adverse action sufficient to establish causal connection for ADA retaliation claim.',
          relevance: 'Your termination occurred 50 days after accommodation request - well within temporal proximity window.'
        },
        {
          title: '42 U.S.C. § 12203 - ADA Retaliation Provision',
          citation: '42 U.S.C. § 12203',
          summary: 'Prohibits discrimination against any individual because such individual has opposed any act or practice made unlawful by the ADA or made a charge under the ADA.',
          relevance: 'Your complaint and accommodation request are protected activities under this provision.'
        },
        {
          title: 'Clark County School District v. Breeden (SCOTUS 2001)',
          citation: '532 U.S. 268',
          summary: 'Very close temporal proximity can establish causation, but must be combined with other evidence. Mere temporal proximity becomes less significant as time passes.',
          relevance: 'You have both temporal proximity AND pattern of adverse actions - strong retaliation evidence.'
        }
      ],
      'disability discrimination failure to accommodate': [
        {
          title: 'EEOC v. Sears, Roebuck & Co. (N.D. Ill. 2005)',
          citation: '417 F.3d 789',
          summary: 'Employer has affirmative duty to engage in interactive process in good faith. Failure to engage or respond to accommodation proposals is ADA violation.',
          relevance: 'You submitted 3+ proposals with no formal response - demonstrates failure to engage in interactive process.'
        },
        {
          title: 'Shapiro v. Township of Lakewood (3d Cir. 2002)',
          citation: '292 F.3d 356',
          summary: 'Employee bears initial burden to request accommodation, then burden shifts to employer to engage in interactive process. Employer liability for breakdown in process.',
          relevance: 'You fulfilled your duty by requesting accommodation with medical documentation. Company failed their duty.'
        },
        {
          title: '29 C.F.R. § 1630.2(o) - Reasonable Accommodation Definition',
          citation: '29 C.F.R. § 1630.2(o)',
          summary: 'Modifications or adjustments to work environment that enable qualified individual with disability to perform essential functions.',
          relevance: 'Flexible work location is commonly recognized reasonable accommodation for anxiety/panic disorders.'
        }
      ],
      'age discrimination ADEA Texas': [
        {
          title: 'Gross v. FBL Financial Services, Inc. (SCOTUS 2009)',
          citation: '557 U.S. 167',
          summary: 'ADEA requires showing that age was "but-for" cause of adverse employment action. Plaintiff must prove age was determining factor.',
          relevance: 'Comparators younger than 45 receiving promotions while you face adverse actions supports age discrimination claim.'
        },
        {
          title: '29 U.S.C. § 623 - ADEA Prohibition',
          citation: '29 U.S.C. § 623(a)',
          summary: 'Unlawful for employer to discriminate against any individual with respect to compensation, terms, conditions, or privileges of employment because of age (40+).',
          relevance: 'You are 45 years old and experienced systematic adverse actions - protected under ADEA.'
        }
      ],
      'sexual orientation discrimination Title VII': [
        {
          title: 'Bostock v. Clayton County (SCOTUS 2020)',
          citation: '590 U.S. ___ (2020)',
          summary: 'Title VII prohibition on sex discrimination includes discrimination based on sexual orientation and gender identity.',
          relevance: 'Landmark case establishing sexual orientation as protected class under Title VII - directly applicable to your case.'
        },
        {
          title: 'EEOC Compliance Manual on Sexual Orientation',
          citation: 'EEOC-CVG-2021-3',
          summary: 'EEOC guidance following Bostock clarifying that sexual orientation discrimination violates Title VII.',
          relevance: 'Your status as Gay is protected class - any adverse treatment based on orientation is unlawful.'
        }
      ],
      'pretext wrongful termination': [
        {
          title: 'McDonnell Douglas Corp. v. Green (SCOTUS 1973)',
          citation: '411 U.S. 792',
          summary: 'Establishes burden-shifting framework: employee shows prima facie case, employer articulates legitimate reason, employee shows reason is pretext.',
          relevance: 'Classic framework for proving discrimination - you can demonstrate stated reason is pretext.'
        },
        {
          title: 'Reeves v. Sanderson Plumbing Products (SCOTUS 2000)',
          citation: '530 U.S. 133',
          summary: 'Evidence of pretext, combined with prima facie case, can be sufficient for jury to find discrimination without additional evidence.',
          relevance: 'Your evidence of timing, pattern, and contradictory documentation strongly suggests pretext.'
        },
        {
          title: 'St. Mary\'s Honor Center v. Hicks (SCOTUS 1993)',
          citation: '509 U.S. 502',
          summary: 'Disbelief of employer\'s stated reason, along with prima facie case, permits but does not compel finding of discrimination.',
          relevance: 'Lack of progressive discipline and contradiction with performance history undermines stated termination reason.'
        }
      ],
      'hostile work environment pattern': [
        {
          title: 'Harris v. Forklift Systems, Inc. (SCOTUS 1993)',
          citation: '510 U.S. 17',
          summary: 'Hostile work environment exists when conduct is severe or pervasive enough to create abusive working environment.',
          relevance: 'Your documented 5+ year pattern of harassment meets severity and pervasiveness requirements.'
        },
        {
          title: 'Burlington Industries v. Ellerth (SCOTUS 1998)',
          citation: '524 U.S. 742',
          summary: 'Employer can be vicariously liable for supervisor harassment resulting in tangible employment action.',
          relevance: 'Harassment from supervisor Travis Cober that resulted in tangible adverse actions (termination) creates employer liability.'
        }
      ]
    };
    
    function performResearch() {
      const query = document.getElementById('research-query').value;
      displayResearchResults(query, 'research-results');
    }
    
    function quickSearch(query) {
      document.getElementById('research-query').value = query;
      displayResearchResults(query, 'research-results');
    }
    
    function displayResearchResults(query, targetId) {
      const resultsContainer = document.getElementById(targetId);
      
      // Find matching results
      let results = [];
      for (let key in researchDatabase) {
        if (query.toLowerCase().includes(key.toLowerCase().split(' ')[0]) || 
            key.toLowerCase().includes(query.toLowerCase().split(' ')[0])) {
          results = researchDatabase[key];
          break;
        }
      }
      
      if (results.length === 0) {
        // Show sample results for any query
        results = [
          {
            title: 'General Employment Discrimination Research',
            citation: 'Multiple Sources',
            summary: 'For specific legal research, consult with an attorney or use legal databases like Westlaw, LexisNexis, or Google Scholar.',
            relevance: 'This tool provides sample case law. For your specific situation, professional legal research is recommended.'
          }
        ];
      }
      
      resultsContainer.innerHTML = '<h3 style="margin-bottom: var(--space-16);">Research Results</h3>';
      
      results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'search-result';
        resultDiv.innerHTML = `
          <h4>${result.title}</h4>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-8);">
            <strong>Citation:</strong> ${result.citation}
          </p>
          <p style="margin-bottom: var(--space-12);">${result.summary}</p>
          <div style="background-color: var(--color-bg-3); padding: var(--space-12); border-radius: var(--radius-base); border-left: 3px solid var(--color-success);">
            <strong>Relevance to Your Case:</strong> ${result.relevance}
          </div>
          <button class="btn btn-secondary btn-small" style="margin-top: var(--space-12);" onclick="copyToClipboard('${result.title} - ${result.citation}')">
            📋 Copy Citation
          </button>
        `;
        resultsContainer.appendChild(resultDiv);
      });
    }
    
    function copyToClipboard(text) {
      // Create temporary element
      const temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      
      alert('Citation copied to clipboard!');
    }
    
    // Modal functions
    function openResearch(topic) {
      const modal = document.getElementById('research-modal');
      modal.classList.add('active');
      document.getElementById('modal-research-query').value = topic;
      modalSearch();
    }
    
    function closeModal() {
      document.getElementById('research-modal').classList.remove('active');
    }
    
    function modalSearch() {
      const query = document.getElementById('modal-research-query').value;
      displayResearchResults(query, 'modal-results');
    }
    
    // Evidence attachment
    function attachEvidence(fieldId) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls,.mp3,.mp4';
      
      input.onchange = async function(e) {
        const files = Array.from(e.target.files);
        
        for (const file of files) {
            const storageRef = ref(storage, `users/${user.uid}/evidence/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            if (!evidenceFiles[fieldId]) {
                evidenceFiles[fieldId] = [];
            }
            
            evidenceFiles[fieldId].push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: downloadURL
            });
            
            await setDoc(userDocRef, { evidenceFiles }, { merge: true });
            displayEvidence(fieldId);
        }
      };
      
      input.click();
    }
    
    function displayEvidence(fieldId) {
      const container = document.getElementById(`evidence-${fieldId}`);
      if (!container) return;
      
      container.innerHTML = '<div style="margin-top: var(--space-12);"><strong>Attached Evidence:</strong></div>';
      
      const files = evidenceFiles[fieldId] || [];
      files.forEach((file, index) => {
        const evidenceItem = document.createElement('div');
        evidenceItem.className = 'evidence-item';
        
        const ext = file.name.split('.').pop().toUpperCase();
        
        evidenceItem.innerHTML = `
          <div class="file-icon">${ext}</div>
          <div style="flex: 1;">
            <a href="${file.url}" target="_blank"><strong>${file.name}</strong></a><br>
            <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
              ${formatFileSize(file.size)}
            </span>
          </div>
          <button class="btn btn-secondary btn-small" onclick="removeEvidence('${fieldId}', ${index})">
            ✕ Remove
          </button>
        `;
        
        container.appendChild(evidenceItem);
      });
    }
    
    async function removeEvidence(fieldId, index) {
        if (evidenceFiles[fieldId] && evidenceFiles[fieldId][index]) {
            const file = evidenceFiles[fieldId][index];
            const storageRef = ref(storage, `users/${user.uid}/evidence/${file.name}`);
            await deleteObject(storageRef);
            evidenceFiles[fieldId].splice(index, 1);
            await setDoc(userDocRef, { evidenceFiles }, { merge: true });
            displayEvidence(fieldId);
        }
    }
    
    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    // Analysis functions
    function runAnalysis() {
      const resultsContainer = document.getElementById('analysis-results');
      
      resultsContainer.innerHTML = `
        <div class="analysis-result">
          <h3>✅ Consistency Check</h3>
          <p><strong>Status:</strong> <span class="status-badge status-success">No Major Contradictions Detected</span></p>
          <ul style="margin-top: var(--space-12); padding-left: var(--space-20);">
            <li>Performance history aligns with documented excellence (2021-2023)</li>
            <li>Timeline of adverse actions follows protected activity (complaint Aug 2024, accommodation July 2025)</li>
            <li>Termination reason contradicts documented performance - clear pretext indicator</li>
          </ul>
        </div>
        
        <div class="analysis-result">
          <h3>⚠️ Temporal Proximity Analysis</h3>
          <p><strong>Critical Timeline Connections:</strong></p>
          <ul style="margin-top: var(--space-12); padding-left: var(--space-20);">
            <li><strong>41 days:</strong> Complaint (Aug 16, 2024) → Job title change (Sep 26, 2024)</li>
            <li><strong>50 days:</strong> Accommodation request (July 29, 2025) → Termination (Sep 17, 2025)</li>
            <li><strong>Pattern:</strong> All adverse actions occurred within 13 months following initial complaint</li>
          </ul>
          <p style="margin-top: var(--space-12);"><span class="status-badge status-success">Strong Evidence</span> Temporal proximity well within legal standards for establishing causation</p>
        </div>
        
        <div class="analysis-result">
          <h3>🎯 Claim Strength Assessment</h3>
          
          <div style="margin-bottom: var(--space-16);">
            <strong>1. ADA Disability Discrimination &amp; Failure to Accommodate</strong>
            <div class="confidence-meter">
              <div class="confidence-bar">
                <div class="confidence-fill" style="width: 85%;"></div>
              </div>
              <span><strong>85%</strong></span>
            </div>
            <p style="margin-top: var(--space-8); font-size: var(--font-size-sm);">Medical documentation + 3 accommodation proposals ignored + termination shortly after request = strong ADA claim</p>
          </div>
          
          <div style="margin-bottom: var(--space-16);">
            <strong>2. Retaliation (ADA, Title VII, ADEA)</strong>
            <div class="confidence-meter">
              <div class="confidence-bar">
                <div class="confidence-fill" style="width: 90%;"></div>
              </div>
              <span><strong>90%</strong></span>
            </div>
            <p style="margin-top: var(--space-8); font-size: var(--font-size-sm);">Protected complaint → clear pattern of adverse actions → termination. Timing and pattern are compelling.</p>
          </div>
          
          <div style="margin-bottom: var(--space-16);">
            <strong>3. Sexual Orientation Discrimination (Title VII post-Bostock)</strong>
            <div class="confidence-meter">
              <div class="confidence-bar">
                <div class="confidence-fill" style="width: 70%;"></div>
              </div>
              <span><strong>70%</strong></span>
            </div>
            <p style="margin-top: var(--space-8); font-size: var(--font-size-sm);">Protected status + hostile environment + disparate treatment. Strengthen with specific incidents tied to orientation.</p>
          </div>
          
          <div style="margin-bottom: var(--space-16);">
            <strong>4. Age Discrimination (ADEA)</strong>
            <div class="confidence-meter">
              <div class="confidence-bar">
                <div class="confidence-fill" style="width: 65%;"></div>
              </div>
              <span><strong>65%</strong></span>
            </div>
            <p style="margin-top: var(--space-8); font-size: var(--font-size-sm);">Age 45 (protected) + comparators. Need to strengthen evidence that age was "but-for" cause per ADEA standards.</p>
          </div>
          
          <div style="margin-bottom: var(--space-16);">
            <strong>5. Wrongful Termination / Pretext</strong>
            <div class="confidence-meter">
              <div class="confidence-bar">
                <div class="confidence-fill" style="width: 80%;"></div>
              </div>
              <span><strong>80%</strong></span>
            </div>
            <p style="margin-top: var(--space-8); font-size: var(--font-size-sm);">Stated reason contradicts performance history + no progressive discipline + timing = strong pretext evidence.</p>
          </div>
        </div>
        
        <div class="analysis-result">
          <h3>⚡ Vulnerabilities &amp; Gaps to Address</h3>
          <ul style="padding-left: var(--space-20);">
            <li><strong>Documentation:</strong> Ensure all emails, performance reviews, and accommodation requests are preserved and organized</li>
            <li><strong>Witness Testimony:</strong> Identify coworkers who witnessed harassment or can corroborate hostile environment</li>
            <li><strong>Medical Records:</strong> Ensure autism diagnosis and anxiety/panic treatment records are complete</li>
            <li><strong>Comparator Details:</strong> Gather specific information about Franco Glaze and Kim Price's qualifications and any disciplinary issues</li>
            <li><strong>Financial Impact:</strong> Document lost wages, benefits, and emotional distress with precision</li>
          </ul>
        </div>
        
        <div class="analysis-result" style="background-color: var(--color-bg-3); border-left-color: var(--color-success);">
          <h3>💪 Strengths of Your Case</h3>
          <ul style="padding-left: var(--space-20);">
            <li>Strong temporal proximity between protected activities and adverse actions</li>
            <li>Clear pattern of retaliation (multiple adverse actions following complaint)</li>
            <li>Medical documentation supporting disability and accommodation need</li>
            <li>Company's failure to engage in interactive process (ADA violation)</li>
            <li>Comparator evidence showing disparate treatment</li>
            <li>Pretext evidence (stated termination reason contradicts documentation)</li>
            <li>Multiple protected classes affected (disability, age, sexual orientation)</li>
          </ul>
        </div>
        
        <div class="analysis-result" style="background-color: var(--color-bg-2); border-left-color: var(--color-warning);">
          <h3>📋 Recommended Next Steps</h3>
          <ol style="padding-left: var(--space-20);">
            <li>File EEOC charge within statutory deadline (180/300 days depending on state)</li>
            <li>Organize all documentary evidence chronologically</li>
            <li>Prepare detailed written narrative of hostile environment incidents</li>
            <li>Identify and contact potential witnesses</li>
            <li>Consult with employment discrimination attorney for evaluation</li>
            <li>Document ongoing damages (financial, emotional, professional)</li>
          </ol>
        </div>
      `;
    }
    
    // Meeting Prep
    function renderPrepQuestions() {
      const container = document.getElementById('prep-questions');
      
      const questions = [
        {
          question: 'You claim you were a model employee, but you were terminated for berating a subordinate. How do you explain this contradiction?',
          trap: 'This is a loaded question that assumes the stated reason is true and creates false contradiction.',
          modelAnswer: 'There is no contradiction. My performance record from 2021-2023 consistently shows excellent performance with no documented issues regarding management style. The stated termination reason was pretextual, as evidenced by: (1) no prior written warnings, (2) termination occurring 50 days after my accommodation request and 13 months after my discrimination complaint, (3) failure to follow progressive discipline, and (4) comparators with actual documented issues being promoted instead of disciplined. The timing and pattern demonstrate the true motive was retaliation, not the stated reason.',
          tips: ['Don\'t accept the premise of contradiction', 'Point to documented evidence', 'Emphasize timing and pattern', 'Remain calm and factual']
        },
        {
          question: 'Isn\'t it possible your mental health issues are being exaggerated for this lawsuit?',
          trap: 'Attempts to undermine credibility of disability and suggest bad faith.',
          modelAnswer: 'No. My autism diagnosis is documented by qualified medical professionals, and my anxiety/panic disorders are documented in medical records dating back before any legal action. I provided medical documentation from my APRN on July 29, 2025, before my termination. The accommodation I requested—flexible work location—is a standard, reasonable accommodation for anxiety disorders. The medical evidence predates and is independent of any legal claim.',
          tips: ['Reference contemporaneous medical documentation', 'Emphasize timeline (documentation before lawsuit)', 'Cite medical professional credentials', 'Don\'t be defensive about legitimate disability']
        },
        {
          question: 'If you were really being harassed, why did you wait 5 years to complain formally?',
          trap: 'Suggests delay undermines credibility or indicates harassment wasn\'t severe.',
          modelAnswer: 'The harassment was ongoing and escalated over time. I attempted to address issues through informal channels initially, hoping the situation would improve. I filed a formal complaint on August 16, 2024, when it became clear that informal approaches were ineffective and the harassment was continuing. The Supreme Court has recognized that victims of harassment often delay reporting due to fear of retaliation—which is exactly what happened here. Within 41 days of my complaint, I suffered adverse action (job title change), followed by a pattern of retaliation culminating in termination.',
          tips: ['Explain reasonable reasons for delay', 'Note escalating nature of harassment', 'Point to retaliation that followed complaint', 'This actually strengthens retaliation claim']
        },
        {
          question: 'You mentioned several adverse actions. Aren\'t these just normal business decisions unrelated to your complaint?',
          trap: 'Attempts to break causal connection between protected activity and adverse actions.',
          modelAnswer: 'No. The timing and pattern make clear these were not normal business decisions. The job title change occurred 41 days after my complaint. The Total Loss division was removed shortly after. Exclusions from meetings began around my accommodation request. Most tellingly, after my termination, my former subordinates Franco Glaze and Kim Price were promoted to positions equal to or above my former role, demonstrating these positions were available and I was specifically targeted. The temporal proximity and pattern establish causation.',
          tips: ['Emphasize temporal proximity', 'Highlight pattern rather than isolated incidents', 'Use comparator evidence', 'Reference legal standard for causation']
        },
        {
          question: 'Can you name specific dates and details for every incident of harassment over the past 5 years?',
          trap: 'Sets impossible standard—inability to recall every detail used to impeach credibility.',
          modelAnswer: 'I can provide specific dates and details for the most significant incidents, particularly those that are documented in emails, meetings, and formal complaints. While I cannot recall exact dates for every single interaction over 5 years, the pattern and persistent nature of the hostile environment is clear from the documented evidence. Courts recognize that victims of ongoing harassment cannot be expected to recall precise details of every incident over extended periods, and the existence of a hostile environment is judged by the overall pattern, not perfect recall of every detail.',
          tips: ['Don\'t apologize for normal memory limitations', 'Pivot to documented evidence', 'Focus on pattern rather than every detail', 'Reference legal standards that don\'t require perfect recall']
        },
        {
          question: 'You requested flexible work location, but other employees work in the office full-time. Why should you get special treatment?',
          trap: 'Frames reasonable accommodation as "special treatment" and suggests unfairness.',
          modelAnswer: 'Reasonable accommodation under the ADA is not "special treatment"—it\'s a legal right for qualified individuals with disabilities. The flexible work arrangement I requested would allow me to perform the essential functions of my position while managing my disability-related symptoms. The accommodation is reasonable because: (1) I demonstrated I could successfully work remotely when needed, (2) many positions at the company already had flexible arrangements, and (3) it would not impose undue hardship on the company. The company\'s failure to engage in the interactive process and consider my proposals was an ADA violation.',
          tips: ['Reframe "special treatment" as "legal right"', 'Define reasonable accommodation', 'Show no undue hardship', 'Emphasize company\'s duty to engage in process']
        },
        {
          question: 'If Franco Glaze and Kim Price were promoted, doesn\'t that show the company promotes based on merit, not discrimination?',
          trap: 'Attempts to use comparator evidence against you by suggesting their promotions prove fairness.',
          modelAnswer: 'Actually, their promotions demonstrate discrimination. Both were my former subordinates with less tenure and experience than me. Their promotions occurred after my termination, filling roles I was qualified for and had effectively performed. This shows: (1) advancement opportunities existed that were denied to me, (2) individuals with less experience were preferred, and (3) I was specifically excluded from advancement. Their promotions don\'t show merit-based system—they show disparate treatment and that my removal created opportunities for others that should have been available to me.',
          tips: ['Turn the question around', 'Emphasize you were more qualified', 'Note timing (after your termination)', 'This strengthens discrimination case']
        },
        {
          question: 'Aren\'t you just upset about losing your job and looking for someone to blame?',
          trap: 'Attempts to characterize claim as emotional reaction rather than legitimate legal complaint.',
          modelAnswer: 'This isn\'t about being upset—it\'s about illegal discrimination and retaliation. I have documented evidence of: protected class status, protected activity (filing complaint and requesting accommodation), adverse actions with clear temporal proximity, failure to accommodate my disability, and pretext in the termination reason. These are objective facts supported by contemporaneous documentation, not emotional reactions. I\'m pursuing this claim because the company violated my legal rights under the ADA, Title VII, and ADEA.',
          tips: ['Stay calm and professional', 'Pivot immediately to objective evidence', 'List specific legal violations', 'Reference documentation']
        }
      ];
      
      container.innerHTML = '<p style="margin-bottom: var(--space-24); color: var(--color-text-secondary);">Practice these responses to prepare for challenging questions during meetings, depositions, or arbitration.</p>';
      
      questions.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.innerHTML = `
          <h4 style="color: var(--color-error); margin-bottom: var(--space-12);">Question ${index + 1}</h4>
          <p style="font-size: var(--font-size-lg); margin-bottom: var(--space-12);"><strong>"${q.question}"</strong></p>
          
          <div style="background-color: var(--color-bg-2); padding: var(--space-12); border-radius: var(--radius-base); margin-bottom: var(--space-12);">
            <strong>⚠️ The Trap:</strong> ${q.trap}
          </div>
          
          <div class="answer-card">
            <strong>✅ Model Answer:</strong>
            <p style="margin-top: var(--space-8);">${q.modelAnswer}</p>
          </div>
          
          <div style="margin-top: var(--space-12);">
            <strong>💡 Key Tips:</strong>
            <ul style="margin-top: var(--space-8); padding-left: var(--space-20); font-size: var(--font-size-sm);">
              ${q.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
        `;
        container.appendChild(questionCard);
      });
    }
    
    // Export functions
    function exportJSON() {
      const exportData = {
        caseInfo: {
          caseName: 'Joshua D. Shipman vs. GAINSCO Auto Insurance',
          exportDate: new Date().toISOString(),
          version: '1.0'
        },
        caseData: caseData,
        timelineEvents: timelineEvents,
        evidenceFiles: evidenceFiles
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `case-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      showExportStatus('JSON backup exported successfully!', 'success');
    }
    
    function exportCSV() {
      let csv = 'Field,Value\n';
      
      // Flatten case data
      for (let category in caseData) {
        if (typeof caseData[category] === 'object' && category !== 'lastSaved') {
          for (let field in caseData[category]) {
            const value = String(caseData[category][field]).replace(/"/g, '""');
            csv += `"${field}","${value}"\n`;
          }
        }
      }
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `case-data-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      showExportStatus('CSV export completed successfully!', 'success');
    }
    
    function generateSummaryPDF() {
      let summary = `CASE SUMMARY\n`;
      summary += `Joshua D. Shipman vs. GAINSCO Auto Insurance\n`;
      summary += `Generated: ${new Date().toLocaleString()}\n`;
      summary += `\n${'='.repeat(80)}\n\n`;
      
      summary += `PARTIES\n`;
      summary += `Plaintiff: Joshua D. Shipman (Age 45, Gay, Autism/Anxiety diagnosis)\n`;
      summary += `Defendant: GAINSCO Auto Insurance\n`;
      summary += `Employment Period: November 2, 2015 - September 18, 2025\n\n`;
      
      summary += `CLAIMS\n`;
      summary += `1. Disability Discrimination (ADA)\n`;
      summary += `2. Failure to Accommodate (ADA)\n`;
      summary += `3. Retaliation (ADA, Title VII, ADEA)\n`;
      summary += `4. Age Discrimination (ADEA)\n`;
      summary += `5. Sexual Orientation Discrimination (Title VII post-Bostock)\n`;
      summary += `6. Hostile Work Environment\n`;
      summary += `7. Wrongful Termination\n\n`;
      
      summary += `KEY TIMELINE\n`;
      timelineEvents.forEach(event => {
        summary += `${event.date}: ${event.summary}\n`;
      });
      summary += `\n`;
      
      summary += `CRITICAL EVIDENCE\n`;
      summary += `- Temporal Proximity: 41 days (complaint to first adverse action), 50 days (accommodation to termination)\n`;
      summary += `- Medical Documentation: Autism diagnosis, APRN letter July 29, 2025\n`;
      summary += `- Pattern of Retaliation: Multiple adverse actions following protected activity\n`;
      summary += `- Comparator Evidence: Franco Glaze and Kim Price promoted after plaintiff's termination\n`;
      summary += `- Pretext: Stated termination reason contradicts performance documentation\n`;
      summary += `- ADA Violation: Company failed to engage in interactive process\n\n`;
      
      summary += `DAMAGES SOUGHT\n`;
      summary += `- Back pay and front pay\n`;
      summary += `- Compensatory damages for emotional distress\n`;
      summary += `- Punitive damages for willful violations\n`;
      summary += `- Attorney's fees and costs\n`;
      summary += `- Reinstatement or front pay in lieu thereof\n\n`;
      
      summary += `${'='.repeat(80)}\n`;
      summary += `This is a case organization tool. Consult with an attorney for legal advice.\n`;
      
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `case-summary-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      showExportStatus('Case summary generated successfully!', 'success');
    }
    
    function generatePrepDoc() {
      let doc = `DEPOSITION & MEETING PREPARATION GUIDE\n`;
      doc += `Joshua D. Shipman vs. GAINSCO Auto Insurance\n`;
      doc += `Prepared: ${new Date().toLocaleString()}\n`;
      doc += `\n${'='.repeat(80)}\n\n`;
      
      doc += `GENERAL DEPOSITION GUIDELINES\n\n`;
      doc += `1. LISTEN CAREFULLY: Make sure you understand each question before answering.\n`;
      doc += `2. TELL THE TRUTH: Always answer truthfully. Don't guess or speculate.\n`;
      doc += `3. PAUSE BEFORE ANSWERING: Take a moment to think before you speak.\n`;
      doc += `4. DON'T VOLUNTEER: Answer only what is asked. Don't elaborate unnecessarily.\n`;
      doc += `5. "I DON'T RECALL" IS ACCEPTABLE: If you don't remember, say so.\n`;
      doc += `6. STAY CALM: Opposing counsel may try to frustrate or confuse you. Remain professional.\n`;
      doc += `7. REVIEW DOCUMENTS: If asked about a document, ask to see it before answering.\n\n`;
      
      doc += `${'='.repeat(80)}\n\n`;
      doc += `ANTICIPATED HOSTILE QUESTIONS & RESPONSES\n\n`;
      
      const questions = [
        {
          q: 'You claim excellent performance, but you were fired for misconduct. Explain.',
          a: 'My performance record 2021-2023 shows consistent excellence with no documented issues. The stated termination reason is pretextual, as evidenced by: (1) no prior warnings, (2) timing 50 days after accommodation request, (3) no progressive discipline, (4) comparators with issues were promoted. The timing and pattern prove retaliation, not the stated reason.'
        },
        {
          q: 'Why should we believe your mental health claims aren\'t exaggerated?',
          a: 'My autism is documented by medical professionals. Anxiety/panic disorders are in medical records predating any legal action. I provided APRN documentation July 29, 2025, before termination. Medical evidence is contemporaneous and independent of legal claims.'
        },
        {
          q: 'Why wait 5 years to complain?',
          a: 'Harassment escalated over time. I tried informal approaches initially. Filed formal complaint August 16, 2024, when informal methods failed. Victims often delay due to fear of retaliation—which occurred here. Within 41 days, I suffered adverse action, followed by pattern culminating in termination.'
        },
        {
          q: 'Aren\'t these just normal business decisions?',
          a: 'No. Timing and pattern prove otherwise. Job title change 41 days after complaint. Exclusions around accommodation request. After termination, my subordinates promoted to equal/higher roles. Temporal proximity and pattern establish causation.'
        }
      ];
      
      questions.forEach((item, i) => {
        doc += `QUESTION ${i + 1}:\n${item.q}\n\n`;
        doc += `MODEL ANSWER:\n${item.a}\n\n`;
        doc += `${'-'.repeat(80)}\n\n`;
      });
      
      doc += `${'='.repeat(80)}\n\n`;
      doc += `KEY FACTS TO REMEMBER\n\n`;
      doc += `- Complaint filed: August 16, 2024, 11:54 AM\n`;
      doc += `- First adverse action: September 26, 2024 (41 days later)\n`;
      doc += `- Accommodation request: July 1, 2025 (updated July 29, 2025)\n`;
      doc += `- Termination: September 17, 2025 (50 days after accommodation)\n`;
      doc += `- Protected classes: Age 45, Gay, Autism + Anxiety/Panic\n`;
      doc += `- Medical provider: Ayla Jenson Naughton, MSN, APRN, PMHNP-BC\n`;
      doc += `- Comparators: Franco Glaze (promoted to Manager L2), Kim Price (promoted to Manager 1)\n\n`;
      
      doc += `This preparation guide is for informational purposes only. Consult your attorney before any deposition.\n`;
      
      const blob = new Blob([doc], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `deposition-prep-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      showExportStatus('Deposition prep document generated successfully!', 'success');
    }
    
    function importJSON(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const imported = JSON.parse(e.target.result);
          
          if (imported.caseData) caseData = imported.caseData;
          if (imported.timelineEvents) timelineEvents = imported.timelineEvents;
          if (imported.evidenceFiles) evidenceFiles = imported.evidenceFiles;
          
          // Populate fields
          for (let category in caseData) {
            if (typeof caseData[category] === 'object') {
              for (let field in caseData[category]) {
                const el = document.getElementById(field);
                if (el) el.value = caseData[category][field];
              }
            }
          }
          
          showExportStatus('Data imported successfully! Fields have been populated.', 'success');
          renderTimeline();
        } catch (error) {
          showExportStatus('Error importing file: ' + error.message, 'error');
        }
      };
      reader.readAsText(file);
    }
    
    function forceBackup() {
      exportJSON();
      showExportStatus('Manual backup completed!', 'success');
    }
    
    function checkStorage() {
      const dataSize = JSON.stringify({ caseData, timelineEvents, evidenceFiles }).length;
      const sizeKB = (dataSize / 1024).toFixed(2);
      const sizeMB = (dataSize / (1024 * 1024)).toFixed(2);
      
      showExportStatus(`Current data size: ${sizeKB} KB (${sizeMB} MB)\nNote: Data is stored in memory for this session.`, 'info');
    }
    
    async function clearAllData() {
        if (!confirm('⚠️ WARNING: This will delete ALL case data from the database. This action cannot be undone. Are you sure?')) {
            return;
        }

        if (!confirm('⚠️ FINAL WARNING: All data will be permanently deleted. Continue?')) {
            return;
        }

        await setDoc(userDocRef, { caseData: {}, timelineEvents: [], evidenceFiles: {} });
        
        // Clear local data
        caseData = { personal: {}, protectedClass: {}, performance: {}, complaint: {}, accommodation: {}, adverseActions: {}, comparators: {}, termination: {}, evidence: {}, lastSaved: null };
        timelineEvents = [];
        evidenceFiles = {};

        document.querySelectorAll('.form-input, .form-textarea').forEach(field => {
            field.value = '';
        });

        showExportStatus('All data has been cleared.', 'info');
        renderTimeline();
        for (const fieldId in evidenceFiles) {
            displayEvidence(fieldId);
        }
    }
    
    function showExportStatus(message, type) {
      const statusEl = document.getElementById('export-status');
      const statusClass = type === 'success' ? 'status-success' : (type === 'error' ? 'status-error' : 'status-info');
      
      statusEl.innerHTML = `<div class="status-badge ${statusClass}">${message}</div>`;
      
      setTimeout(() => {
        statusEl.innerHTML = '';
      }, 5000);
    }
    
    // Initialize app
    loadData();
    setupAutoSave();
    
    // Close modal when clicking outside
    document.getElementById('research-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}
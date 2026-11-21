import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrantService, GrantProgram } from '../../services/grant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="programs-page">
      <!-- WIZARD MODE: MATCHES THE WIREFRAME EXACTLY -->
      <div class="wizard-container" *ngIf="showWizard">
        <!-- Title & Save Draft Button -->
        <div class="wizard-header">
          <div>
            <h1 class="wizard-title">Set up grant program</h1>
            <div class="wizard-subtitle">{{ form.programName || 'New Grant Program' }} / {{ form.status }}</div>
          </div>
          <div class="wizard-header-actions">
            <button class="btn btn-outline" (click)="saveDraft()">Save draft</button>
            <button class="btn btn-outline" (click)="cancelWizard()">&times; Close</button>
          </div>
        </div>

        <!-- 4-STEP TABS / STEPPER -->
        <div class="stepper-bar">
          <button 
            type="button"
            class="step-item" 
            [class.active]="currentStep === 1" 
            (click)="currentStep = 1">
            <span class="step-num">1</span> Details
          </button>
          <span class="step-divider">/</span>
          <button 
            type="button"
            class="step-item" 
            [class.active]="currentStep === 2" 
            (click)="currentStep = 2">
            <span class="step-num">2</span> Eligibility
          </button>
          <span class="step-divider">/</span>
          <button 
            type="button"
            class="step-item" 
            [class.active]="currentStep === 3" 
            (click)="currentStep = 3">
            <span class="step-num">3</span> Application form
          </button>
          <span class="step-divider">/</span>
          <button 
            type="button"
            class="step-item" 
            [class.active]="currentStep === 4" 
            (click)="currentStep = 4">
            <span class="step-num">4</span> Review &amp; publish
          </button>
        </div>

        <!-- STEP 1: DETAILS -->
        <div class="step-content" *ngIf="currentStep === 1">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Program name <span class="required">*</span></label>
              <input 
                type="text" 
                class="form-input" 
                [(ngModel)]="form.programName" 
                placeholder="e.g. Community Impact 2026">
            </div>

            <div class="form-group">
              <label class="form-label">Total budget (INR) <span class="required">*</span></label>
              <div class="input-with-prefix">
                <span class="input-prefix">₹</span>
                <input 
                  type="number" 
                  class="form-input" 
                  [(ngModel)]="form.totalBudgetInr" 
                  placeholder="50,000,000">
              </div>
            </div>
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label">Opens <span class="required">*</span></label>
              <input 
                type="date" 
                class="form-input" 
                [(ngModel)]="form.opensAt">
            </div>

            <div class="form-group">
              <label class="form-label">Closes <span class="required">*</span></label>
              <input 
                type="date" 
                class="form-input" 
                [(ngModel)]="form.closesAt">
            </div>

            <div class="form-group">
              <label class="form-label">Award range (INR) <span class="required">*</span></label>
              <div class="range-inputs">
                <input 
                  type="number" 
                  class="form-input" 
                  [(ngModel)]="form.minAwardInr" 
                  placeholder="Min (e.g. 1000000)">
                <span class="range-sep">&ndash;</span>
                <input 
                  type="number" 
                  class="form-input" 
                  [(ngModel)]="form.maxAwardInr" 
                  placeholder="Max (e.g. 5000000)">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Category / Sector <span class="required">*</span></label>
            <select class="form-select" [(ngModel)]="form.category">
              <option value="Healthcare & Sanitation">Healthcare &amp; Sanitation</option>
              <option value="AgriTech & Rural">AgriTech &amp; Rural Development</option>
              <option value="Clean Energy & Climate">Clean Energy &amp; Decarbonization</option>
              <option value="STEM Education">STEM Education &amp; Innovation</option>
              <option value="Water Conservation">Water Conservation &amp; Rejuvenation</option>
              <option value="Digital Governance">Digital Governance &amp; Public Delivery</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Description &amp; Strategic Objectives</label>
            <textarea 
              class="form-textarea" 
              [(ngModel)]="form.description" 
              rows="6"
              placeholder="Detail the target demographics, primary public mission, measurable milestones, and expected socioeconomic outcomes..."></textarea>
          </div>

          <div class="wizard-footer">
            <div class="wizard-hint">
              Publishing opens the opportunity to applicants.<br>
              Next: customize questions, attachments and scoring criteria.
            </div>
            <div class="wizard-actions">
              <button class="btn btn-outline" (click)="currentStep = 4">Preview</button>
              <button class="btn btn-primary" (click)="currentStep = 2">Next: Eligibility &rarr;</button>
            </div>
          </div>
        </div>

        <!-- STEP 2: ELIGIBILITY CRITERIA -->
        <div class="step-content" *ngIf="currentStep === 2">
          <h3 class="step-heading">Configure Scheme Eligibility Rules</h3>
          <p class="step-desc">Applications will be screened in real-time by the automated eligibility engine against these criteria.</p>

          <div class="eligibility-card">
            <div class="form-group">
              <label class="form-label">Eligible Beneficiary / Organization Types <span class="required">*</span></label>
              <div class="checkbox-row">
                <label class="checkbox-item">
                  <input type="checkbox" [(ngModel)]="eligConfig.ngo"> Registered NGOs / Societies / Trusts
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" [(ngModel)]="eligConfig.academic"> Academic Institutions &amp; Universities
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" [(ngModel)]="eligConfig.startup"> DPIIT Recognized Startups
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" [(ngModel)]="eligConfig.lab"> Scientific Research Laboratories
                </label>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Minimum Operating Standing (Years)</label>
                <input type="number" class="form-input" [(ngModel)]="eligConfig.minYears" placeholder="e.g. 3">
              </div>

              <div class="form-group">
                <label class="form-label">Turnover Ceiling Limit (INR)</label>
                <input type="number" class="form-input" [(ngModel)]="eligConfig.maxTurnover" placeholder="e.g. 100,000,000 (0 for no limit)">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Mandatory Verification Certificates</label>
              <div class="checkbox-row">
                <label class="checkbox-item">
                  <input type="checkbox" [(ngModel)]="eligConfig.requirePan" checked disabled> PAN / Registration Certificate
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" [(ngModel)]="eligConfig.requireDarpan"> NITI Aayog NGO Darpan Registration
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" [(ngModel)]="eligConfig.requireAudit"> 2-Year Audited Financial Statements
                </label>
              </div>
            </div>
          </div>

          <div class="wizard-footer">
            <button class="btn btn-outline" (click)="currentStep = 1">&larr; Back to Details</button>
            <div class="wizard-actions">
              <button class="btn btn-primary" (click)="currentStep = 3">Next: Application Form &rarr;</button>
            </div>
          </div>
        </div>

        <!-- STEP 3: APPLICATION FORM CONFIG -->
        <div class="step-content" *ngIf="currentStep === 3">
          <h3 class="step-heading">Application Questions &amp; Evaluation Weightage</h3>
          <p class="step-desc">Configure proposal submission sections and review committee rubric weights.</p>

          <div class="form-section-card">
            <h4 class="card-subtitle">Default Submission Questions (Included in Applicant Form):</h4>
            <ul class="configured-fields-list">
              <li><strong>1. Project Title &amp; Executive Summary:</strong> Target talukas, baseline issues, community beneficiaries.</li>
              <li><strong>2. Technical Blueprint &amp; Methodology:</strong> Work plan, equipment procurement, milestones breakdown.</li>
              <li><strong>3. Financial Budget Breakdown:</strong> Personnel costs, capital expenditure, operational expenditure in INR.</li>
              <li><strong>4. Measurable Key Outcomes:</strong> Impact metrics, quarterly deliverables, statutory audits.</li>
            </ul>

            <h4 class="card-subtitle" style="margin-top: 18px;">Review Evaluation Weightage Rubric (Total: 100 Points):</h4>
            <div class="rubric-grid">
              <div class="rubric-box">
                <div class="rubric-score">30 Pts</div>
                <div class="rubric-name">Technical Feasibility</div>
                <div class="rubric-desc">Soundness of technical proposal, milestones, and implementation architecture.</div>
              </div>
              <div class="rubric-box">
                <div class="rubric-score">30 Pts</div>
                <div class="rubric-name">Social &amp; Public Impact</div>
                <div class="rubric-desc">Direct reach to marginalized populations and measurable welfare generation.</div>
              </div>
              <div class="rubric-box">
                <div class="rubric-score">20 Pts</div>
                <div class="rubric-name">Financial Justification</div>
                <div class="rubric-desc">Cost efficiency, competitive procurement, and fund utilization structure.</div>
              </div>
              <div class="rubric-box">
                <div class="rubric-score">20 Pts</div>
                <div class="rubric-name">Organizational Capacity</div>
                <div class="rubric-desc">Track record, leadership experience, and statutory compliance history.</div>
              </div>
            </div>
          </div>

          <div class="wizard-footer">
            <button class="btn btn-outline" (click)="currentStep = 2">&larr; Back to Eligibility</button>
            <div class="wizard-actions">
              <button class="btn btn-primary" (click)="currentStep = 4">Next: Review &amp; Publish &rarr;</button>
            </div>
          </div>
        </div>

        <!-- STEP 4: REVIEW & PUBLISH -->
        <div class="step-content" *ngIf="currentStep === 4">
          <h3 class="step-heading">Final Verification &amp; Authorization</h3>
          <p class="step-desc">Verify grant program details before publishing to public portal.</p>

          <div class="preview-card">
            <div class="preview-header">
              <div class="preview-code">{{ form.programCode || 'GMS-2026-CIP-NEW' }}</div>
              <div class="badge badge-published" *ngIf="form.status === 'PUBLISHED'">PUBLISHED</div>
              <div class="badge badge-draft" *ngIf="form.status === 'DRAFT'">DRAFT</div>
            </div>
            <h2 class="preview-title">{{ form.programName }}</h2>
            <div class="preview-meta">
              <span><strong>Category:</strong> {{ form.category }}</span> &bull;
              <span><strong>Total Budget:</strong> ₹{{ form.totalBudgetInr | number }}</span> &bull;
              <span><strong>Award Range:</strong> ₹{{ form.minAwardInr | number }} &ndash; ₹{{ form.maxAwardInr | number }}</span>
            </div>
            <div class="preview-dates">
              <strong>Application Window:</strong> {{ form.opensAt }} to {{ form.closesAt }}
            </div>
            <p class="preview-desc">{{ form.description }}</p>

            <div class="preview-rules">
              <strong>Configured Eligibility Criteria:</strong>
              <ul>
                <li><strong>Eligible Orgs:</strong> {{ getEligibleOrgTypes() }}</li>
                <li><strong>Minimum Experience:</strong> {{ eligConfig.minYears }} Years</li>
                <li><strong>Turnover Ceiling:</strong> {{ eligConfig.maxTurnover ? ('₹' + (eligConfig.maxTurnover | number)) : 'No Upper Limit' }}</li>
                <li><strong>Mandatory Docs:</strong> Society/Startup Registration, PAN, {{ eligConfig.requireDarpan ? 'NGO Darpan ID, ' : '' }} Audited Balance Sheets</li>
              </ul>
            </div>
          </div>

          <div class="wizard-footer">
            <button class="btn btn-outline" (click)="currentStep = 3">&larr; Back to Application Form</button>
            <div class="wizard-actions">
              <button class="btn btn-outline" (click)="saveDraft()" [disabled]="submitting">Save as Draft</button>
              <button class="btn btn-primary" (click)="publishProgram()" [disabled]="submitting">
                {{ submitting ? 'Publishing to Database...' : 'Publish Program' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MASTER PROGRAMS LIST VIEW -->
      <div class="programs-list-view" *ngIf="!showWizard">
        <div class="view-header">
          <div>
            <h1 class="page-title">Grant Programs</h1>
            <p class="page-desc">Setup, monitor and administer national grant opportunities and public fund schemes.</p>
          </div>
          <button class="btn btn-primary" (click)="openWizard()">
            + Set up grant program
          </button>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar">
          <div class="filter-pills">
            <button class="filter-pill" [class.active]="selectedStatus === ''" (click)="filterStatus('')">All ({{ programs.length }})</button>
            <button class="filter-pill" [class.active]="selectedStatus === 'PUBLISHED'" (click)="filterStatus('PUBLISHED')">Published</button>
            <button class="filter-pill" [class.active]="selectedStatus === 'DRAFT'" (click)="filterStatus('DRAFT')">Drafts</button>
            <button class="filter-pill" [class.active]="selectedStatus === 'CLOSED'" (click)="filterStatus('CLOSED')">Closed</button>
          </div>
          <div class="search-box">
            <input type="text" class="form-input search-input" [(ngModel)]="searchQuery" placeholder="Search program code or title...">
          </div>
        </div>

        <!-- Programs Table -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Program Name &amp; Sector</th>
                <th>Total Budget (INR)</th>
                <th>Allocated / Disbursed</th>
                <th>Application Window</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filteredPrograms">
                <td>
                  <strong class="code-badge">{{ p.programCode }}</strong>
                </td>
                <td>
                  <div class="prog-title">{{ p.programName }}</div>
                  <span class="prog-category">{{ p.category }}</span>
                </td>
                <td>
                  <strong class="inr-amount">₹{{ p.totalBudgetInr | number }}</strong>
                  <div class="award-range">Award: ₹{{ p.minAwardInr | number }} &ndash; ₹{{ p.maxAwardInr | number }}</div>
                </td>
                <td>
                  <div class="budget-progress">
                    <div class="budget-bar">
                      <div class="bar-fill" [style.width.%]="getPercent(p.allocatedBudgetInr, p.totalBudgetInr)"></div>
                    </div>
                    <span class="budget-stat">₹{{ p.allocatedBudgetInr | number }} allocated</span>
                  </div>
                </td>
                <td>
                  <span class="date-range">{{ p.opensAt }} to {{ p.closesAt }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + p.status.toLowerCase()">{{ p.status }}</span>
                </td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-sm btn-outline" (click)="viewProgramDetails(p)">Details</button>
                    <button 
                      class="btn btn-sm btn-primary" 
                      *ngIf="p.status === 'DRAFT'" 
                      (click)="toggleStatus(p, 'PUBLISHED')">
                      Publish
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PROGRAM DETAIL MODAL -->
      <div class="modal-overlay" *ngIf="selectedProgram" (click)="selectedProgram = null">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <span class="badge" [ngClass]="'badge-' + selectedProgram.status.toLowerCase()">{{ selectedProgram.status }}</span>
              <h2 class="modal-title" style="margin-top: 6px;">{{ selectedProgram.programName }}</h2>
              <div class="code-badge">{{ selectedProgram.programCode }}</div>
            </div>
            <button class="btn btn-sm btn-outline" (click)="selectedProgram = null">&times;</button>
          </div>

          <div class="modal-body">
            <p class="modal-desc">{{ selectedProgram.description }}</p>

            <div class="metrics-row">
              <div class="metric-card">
                <span class="m-label">Total Scheme Budget</span>
                <span class="m-val">₹{{ selectedProgram.totalBudgetInr | number }}</span>
              </div>
              <div class="metric-card">
                <span class="m-label">Allocated to Grants</span>
                <span class="m-val">₹{{ selectedProgram.allocatedBudgetInr | number }}</span>
              </div>
              <div class="metric-card">
                <span class="m-label">Disbursed by Treasury</span>
                <span class="m-val">₹{{ selectedProgram.disbursedBudgetInr | number }}</span>
              </div>
            </div>

            <h4 style="margin: 18px 0 8px 0;">Scheme Criteria &amp; Guidelines:</h4>
            <ul class="criteria-list">
              <li *ngFor="let c of selectedProgram.criteria">
                <strong>{{ c.criterionName }}:</strong> {{ c.criterionValue }} ({{ c.isMandatory ? 'Mandatory' : 'Optional' }})
              </li>
              <li *ngIf="!selectedProgram.criteria || selectedProgram.criteria.length === 0">
                Standard public sector guidelines apply (PAN, Registration, Audit adherence).
              </li>
            </ul>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="selectedProgram = null">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .programs-page {
      width: 100%;
      max-width: 1180px;
    }

    /* WIZARD STYLES (MATCHES WIREFRAME EXACTLY) */
    .wizard-container {
      background: #ffffff;
    }

    .wizard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .wizard-title {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    .wizard-subtitle {
      font-size: 14px;
      color: #64748b;
      margin-top: 2px;
    }

    .wizard-header-actions {
      display: flex;
      gap: 10px;
    }

    /* STEPPER BAR */
    .stepper-bar {
      display: flex;
      align-items: center;
      background-color: #f1f5f9;
      border-radius: 6px;
      padding: 10px 18px;
      margin-bottom: 28px;
      gap: 12px;
    }

    .step-item {
      background: none;
      border: none;
      font-size: 13.5px;
      font-weight: 500;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.15s ease;
    }

    .step-item:hover {
      color: #0f172a;
    }

    .step-item.active {
      font-weight: 700;
      color: #0f172a;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .step-num {
      font-weight: 700;
    }

    .step-divider {
      color: #cbd5e1;
    }

    /* FORM GRIDS */
    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1.3fr;
      gap: 20px;
    }

    .input-with-prefix {
      display: flex;
      align-items: center;
      position: relative;
    }

    .input-prefix {
      position: absolute;
      left: 12px;
      color: #64748b;
      font-weight: 600;
      pointer-events: none;
    }

    .input-with-prefix .form-input {
      padding-left: 28px;
    }

    .range-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .range-sep {
      color: #64748b;
      font-weight: bold;
    }

    /* FOOTER */
    .wizard-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #f1f5f9;
    }

    .wizard-hint {
      font-size: 13px;
      color: #64748b;
      line-height: 1.4;
    }

    .wizard-actions {
      display: flex;
      gap: 12px;
    }

    /* ELIGIBILITY STYLES */
    .step-heading {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .step-desc {
      font-size: 13.5px;
      color: #64748b;
      margin-bottom: 20px;
    }

    .eligibility-card, .form-section-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 24px;
    }

    .checkbox-row {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 8px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      color: #334155;
      cursor: pointer;
    }

    /* RUBRIC */
    .rubric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .rubric-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 14px;
    }

    .rubric-score {
      font-size: 18px;
      font-weight: 800;
      color: #1e293b;
    }

    .rubric-name {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
      margin-top: 2px;
    }

    .rubric-desc {
      font-size: 11.5px;
      color: #64748b;
      margin-top: 4px;
    }

    .configured-fields-list {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
      font-size: 13.5px;
    }

    /* PREVIEW CARD */
    .preview-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 24px;
      background: #f8fafc;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .preview-title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .preview-meta {
      font-size: 13px;
      color: #475569;
      margin-bottom: 6px;
    }

    .preview-dates {
      font-size: 13px;
      color: #0369a1;
      background: #e0f2fe;
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 14px;
    }

    .preview-desc {
      font-size: 13.5px;
      color: #334155;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .preview-rules {
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      font-size: 13px;
    }

    .preview-rules ul {
      margin-left: 20px;
      margin-top: 6px;
    }

    /* LIST VIEW */
    .view-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
    }

    .page-desc {
      font-size: 13.5px;
      color: #64748b;
      margin-top: 2px;
    }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      gap: 16px;
    }

    .filter-pills {
      display: flex;
      gap: 8px;
    }

    .filter-pill {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12.5px;
      font-weight: 500;
      color: #475569;
      transition: all 0.15s ease;
    }

    .filter-pill.active {
      background: #1e293b;
      color: #ffffff;
      border-color: #1e293b;
    }

    .search-input {
      width: 280px;
      padding: 7px 12px;
    }

    .code-badge {
      font-family: monospace;
      font-size: 12px;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      color: #1e293b;
    }

    .prog-title {
      font-weight: 600;
      color: #0f172a;
    }

    .prog-category {
      font-size: 11.5px;
      color: #64748b;
    }

    .inr-amount {
      font-size: 14px;
      color: #0f172a;
    }

    .award-range {
      font-size: 11.5px;
      color: #64748b;
    }

    .budget-progress {
      width: 140px;
    }

    .budget-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .bar-fill {
      height: 100%;
      background: #2563eb;
    }

    .budget-stat {
      font-size: 11px;
      color: #64748b;
    }

    .date-range {
      font-size: 12px;
      color: #475569;
    }

    .table-actions {
      display: flex;
      gap: 6px;
    }

    /* MODAL */
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }

    .modal-title {
      font-size: 20px;
      font-weight: 700;
    }

    .modal-desc {
      font-size: 13.5px;
      line-height: 1.5;
      color: #334155;
      margin-bottom: 16px;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
    }

    .m-label {
      display: block;
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
    }

    .m-val {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 4px;
    }

    .criteria-list {
      margin-left: 20px;
      font-size: 13px;
      color: #334155;
    }
  `]
})
export class ProgramsComponent implements OnInit {
  programs: GrantProgram[] = [];
  selectedStatus = '';
  searchQuery = '';
  showWizard = false;
  currentStep = 1;
  submitting = false;
  selectedProgram: GrantProgram | null = null;

  // Form matching wireframe defaults
  form: any = {
    programCode: '',
    programName: 'Community Impact 2026',
    totalBudgetInr: 50000000,
    opensAt: '2026-04-01',
    closesAt: '2026-06-30',
    minAwardInr: 1000000,
    maxAwardInr: 5000000,
    category: 'Healthcare & Sanitation',
    description: 'Empowering community-driven healthcare initiatives, primary wellness centers, and decentralized sanitation across underserved tier-2 and rural districts in India.',
    status: 'Draft'
  };

  eligConfig = {
    ngo: true,
    academic: true,
    startup: false,
    lab: false,
    minYears: 3,
    maxTurnover: 100000000,
    requirePan: true,
    requireDarpan: true,
    requireAudit: true
  };

  constructor(private grantService: GrantService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.grantService.getPrograms().subscribe({
      next: (data) => {
        this.programs = data;
      }
    });
  }

  get filteredPrograms(): GrantProgram[] {
    return this.programs.filter(p => {
      const matchStatus = !this.selectedStatus || p.status.toUpperCase() === this.selectedStatus.toUpperCase();
      const matchQuery = !this.searchQuery || 
        p.programName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.programCode.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }

  filterStatus(status: string): void {
    this.selectedStatus = status;
  }

  openWizard(): void {
    this.showWizard = true;
    this.currentStep = 1;
  }

  cancelWizard(): void {
    this.showWizard = false;
  }

  getPercent(num: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.round((num / total) * 100));
  }

  getEligibleOrgTypes(): string {
    const types: string[] = [];
    if (this.eligConfig.ngo) types.push('NGO');
    if (this.eligConfig.academic) types.push('Academic Institutions');
    if (this.eligConfig.startup) types.push('Startups');
    if (this.eligConfig.lab) types.push('Research Labs');
    return types.join(', ');
  }

  saveDraft(): void {
    this.form.status = 'DRAFT';
    this.submitProgramPayload();
  }

  publishProgram(): void {
    this.form.status = 'PUBLISHED';
    this.submitProgramPayload();
  }

  private submitProgramPayload(): void {
    this.submitting = true;

    const criteria = [
      {
        criterionType: 'ORG_TYPE',
        criterionName: 'Eligible Organization Types',
        criterionValue: this.getEligibleOrgTypes(),
        isMandatory: 1
      },
      {
        criterionType: 'MIN_EXPERIENCE_YEARS',
        criterionName: 'Minimum Operational Experience',
        criterionValue: String(this.eligConfig.minYears || 3),
        isMandatory: 1
      }
    ];

    if (this.eligConfig.maxTurnover) {
      criteria.push({
        criterionType: 'MAX_TURNOVER_INR',
        criterionName: 'Maximum Annual Turnover Allowed',
        criterionValue: String(this.eligConfig.maxTurnover),
        isMandatory: 0
      });
    }

    const payload = {
      ...this.form,
      criteria
    };

    this.grantService.createProgram(payload).subscribe({
      next: (saved) => {
        this.submitting = false;
        this.showWizard = false;
        this.loadPrograms();
        alert(`Program ${saved.programName} (${saved.programCode}) has been successfully saved to the database with status: ${saved.status}!`);
      },
      error: (err) => {
        this.submitting = false;
        alert('Error saving program: ' + (err.error?.error || err.message));
      }
    });
  }

  toggleStatus(p: GrantProgram, newStatus: string): void {
    this.grantService.updateProgramStatus(p.programId, newStatus).subscribe({
      next: () => {
        this.loadPrograms();
      }
    });
  }

  viewProgramDetails(p: GrantProgram): void {
    this.selectedProgram = p;
  }
}

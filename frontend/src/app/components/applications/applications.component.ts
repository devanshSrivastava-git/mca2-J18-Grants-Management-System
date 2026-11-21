import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrantService, Application, GrantProgram, EligibilityResult } from '../../services/grant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="apps-page">
      <div class="view-header">
        <div>
          <h1 class="page-title">Applications &amp; Proposals</h1>
          <p class="page-desc">Track proposal submissions, run eligibility validations, manage technical evaluations and formal grant awards.</p>
        </div>
        <button class="btn btn-primary" (click)="openSubmitModal()">
          + Submit New Application
        </button>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-pills">
          <button class="filter-pill" [class.active]="selectedStatus === ''" (click)="filterStatus('')">All ({{ applications.length }})</button>
          <button class="filter-pill" [class.active]="selectedStatus === 'SUBMITTED'" (click)="filterStatus('SUBMITTED')">Submitted</button>
          <button class="filter-pill" [class.active]="selectedStatus === 'UNDER_REVIEW'" (click)="filterStatus('UNDER_REVIEW')">Under Review</button>
          <button class="filter-pill" [class.active]="selectedStatus === 'APPROVED'" (click)="filterStatus('APPROVED')">Approved</button>
          <button class="filter-pill" [class.active]="selectedStatus === 'DISBURSED'" (click)="filterStatus('DISBURSED')">Disbursed</button>
          <button class="filter-pill" [class.active]="selectedStatus === 'REJECTED'" (click)="filterStatus('REJECTED')">Rejected</button>
        </div>
        <input type="text" class="form-input search-input" [(ngModel)]="searchQuery" placeholder="Search application number, title or org...">
      </div>

      <!-- Applications Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>App Number</th>
              <th>Applicant &amp; Organization</th>
              <th>Project Proposal</th>
              <th>Requested (INR)</th>
              <th>Eligibility</th>
              <th>Workflow Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of filteredApplications">
              <td>
                <strong class="code-badge">{{ app.applicationNumber }}</strong>
                <div class="sub-date" *ngIf="app.submissionDate">{{ app.submissionDate | slice:0:10 }}</div>
              </td>
              <td>
                <div class="org-name">{{ app.organization?.orgName }}</div>
                <div class="applicant-meta">{{ app.applicantUser?.fullName }} &bull; {{ app.organization?.city }}, {{ app.organization?.state }}</div>
              </td>
              <td>
                <div class="project-title">{{ app.projectTitle }}</div>
                <div class="scheme-name">{{ app.program.programName }}</div>
              </td>
              <td>
                <strong class="inr-amount">₹{{ app.requestedAmountInr | number }}</strong>
                <div class="approved-val" *ngIf="app.approvedAmountInr">
                  Awarded: ₹{{ app.approvedAmountInr | number }}
                </div>
              </td>
              <td>
                <span class="badge" [ngClass]="'badge-' + app.eligibilityStatus.toLowerCase()">
                  {{ app.eligibilityStatus }}
                </span>
              </td>
              <td>
                <span class="badge" [ngClass]="'badge-' + app.applicationStatus.toLowerCase().replace('_', '-')">
                  {{ app.applicationStatus }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-sm btn-outline" (click)="viewAppDetails(app)">View</button>
                  <button 
                    class="btn btn-sm btn-outline" 
                    *ngIf="app.applicationStatus === 'SUBMITTED'"
                    (click)="openAssignModal(app)">
                    Assign
                  </button>
                  <button 
                    class="btn btn-sm btn-primary" 
                    *ngIf="app.applicationStatus === 'UNDER_REVIEW' || app.applicationStatus === 'SUBMITTED'"
                    (click)="openDecisionModal(app)">
                    Decision
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SUBMIT NEW APPLICATION MODAL WITH REAL-TIME ELIGIBILITY ENGINE -->
      <div class="modal-overlay" *ngIf="showSubmitModal" (click)="showSubmitModal = false">
        <div class="modal-content submit-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Submit Grant Proposal</h2>
              <div class="modal-desc" style="margin: 0;">Fill application details and execute automated eligibility check.</div>
            </div>
            <button class="btn btn-sm btn-outline" (click)="showSubmitModal = false">&times;</button>
          </div>

          <div class="modal-body">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Select Grant Scheme <span class="required">*</span></label>
                <select class="form-select" [(ngModel)]="subForm.programId" (change)="onProgramSelect()">
                  <option [ngValue]="null">-- Select a Published Grant Program --</option>
                  <option *ngFor="let p of publishedPrograms" [ngValue]="p.programId">
                    {{ p.programName }} (Window: ₹{{ p.minAwardInr | number }} - ₹{{ p.maxAwardInr | number }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Applicant Organization <span class="required">*</span></label>
                <select class="form-select" [(ngModel)]="subForm.orgId">
                  <option *ngFor="let o of organizations" [ngValue]="o.orgId">
                    {{ o.orgName }} ({{ o.orgType }}, {{ o.city }})
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Project Title <span class="required">*</span></label>
              <input type="text" class="form-input" [(ngModel)]="subForm.projectTitle" placeholder="e.g. Mobile Primary Healthcare Diagnostic Network">
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Requested Grant Amount (INR) <span class="required">*</span></label>
                <input type="number" class="form-input" [(ngModel)]="subForm.requestedAmountInr" placeholder="e.g. 2,500,000">
              </div>

              <div class="form-group">
                <label class="form-label">Project Execution Duration (Months)</label>
                <input type="number" class="form-input" [(ngModel)]="subForm.projectDurationMonths" placeholder="e.g. 18">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Executive Summary &amp; Proposed Solution <span class="required">*</span></label>
              <textarea 
                class="form-textarea" 
                [(ngModel)]="subForm.executiveSummary" 
                rows="4" 
                placeholder="Describe baseline socioeconomic need, deployment blueprint, measurable beneficiaries, and milestones..."></textarea>
            </div>

            <!-- AUTOMATED ELIGIBILITY CHECK SECTION -->
            <div class="eligibility-check-panel">
              <div class="check-panel-header">
                <div>
                  <strong>Automated Eligibility Validation Engine</strong>
                  <div style="font-size: 12px; color: #64748b;">Instant rule verification against scheme constraints</div>
                </div>
                <button type="button" class="btn btn-sm btn-accent" (click)="runEligibilityCheck()" [disabled]="checkingEligibility || !subForm.programId">
                  {{ checkingEligibility ? 'Verifying...' : '⚡ Run Eligibility Check' }}
                </button>
              </div>

              <div *ngIf="eligibilityResult" class="check-result" [ngClass]="eligibilityResult.eligible ? 'result-pass' : 'result-fail'">
                <div class="result-summary">
                  <span class="badge" [ngClass]="eligibilityResult.eligible ? 'badge-eligible' : 'badge-ineligible'">
                    {{ eligibilityResult.status }}
                  </span>
                  <span class="summary-text">{{ eligibilityResult.summary }}</span>
                </div>

                <div class="criteria-results">
                  <div *ngFor="let item of eligibilityResult.details" class="item-result">
                    <span class="status-icon">{{ item.passed ? '✅' : '❌' }}</span>
                    <div>
                      <strong>{{ item.criterionName }}:</strong>
                      <span class="item-msg">{{ item.message }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="showSubmitModal = false">Cancel</button>
            <button class="btn btn-primary" (click)="submitProposal()" [disabled]="submittingApp">
              {{ submittingApp ? 'Submitting to Database...' : 'Submit Application Proposal' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ASSIGN REVIEWER MODAL -->
      <div class="modal-overlay" *ngIf="targetAppForAssign" (click)="targetAppForAssign = null">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Assign Proposal for Technical Review</h3>
            <button class="btn btn-sm btn-outline" (click)="targetAppForAssign = null">&times;</button>
          </div>
          <div class="modal-body">
            <p>Assign application <strong>{{ targetAppForAssign.applicationNumber }}</strong> &mdash; <em>{{ targetAppForAssign.projectTitle }}</em> to a subject matter evaluator.</p>
            <div class="form-group" style="margin-top: 16px;">
              <label class="form-label">Select Reviewer</label>
              <select class="form-select" [(ngModel)]="selectedReviewerId">
                <option *ngFor="let rev of reviewers" [ngValue]="rev.userId">
                  {{ rev.fullName }} ({{ rev.designation }}) &bull; {{ rev.email }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="targetAppForAssign = null">Cancel</button>
            <button class="btn btn-primary" (click)="confirmAssignReviewer()">Confirm Assignment</button>
          </div>
        </div>
      </div>

      <!-- APPROVAL DECISION MODAL -->
      <div class="modal-overlay" *ngIf="targetAppForDecision" (click)="targetAppForDecision = null">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Grant Committee Final Decision</h3>
            <button class="btn btn-sm btn-outline" (click)="targetAppForDecision = null">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Proposal</label>
              <div><strong>{{ targetAppForDecision.applicationNumber }}</strong> &mdash; {{ targetAppForDecision.projectTitle }}</div>
              <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Requested: ₹{{ targetAppForDecision.requestedAmountInr | number }}</div>
            </div>

            <div class="form-group">
              <label class="form-label">Decision <span class="required">*</span></label>
              <select class="form-select" [(ngModel)]="decisionForm.decision">
                <option value="APPROVED">APPROVE Grant Award</option>
                <option value="REJECTED">REJECT Proposal</option>
              </select>
            </div>

            <div class="form-group" *ngIf="decisionForm.decision === 'APPROVED'">
              <label class="form-label">Approved Award Amount (INR) <span class="required">*</span></label>
              <input type="number" class="form-input" [(ngModel)]="decisionForm.approvedAmountInr">
              <div style="font-size: 11.5px; color: #16a34a; margin-top: 4px;">
                &bull; Two disbursement tranches (40% advance, 60% completion) will automatically be scheduled in the database.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Executive Committee Remarks</label>
              <textarea class="form-textarea" [(ngModel)]="decisionForm.remarks" rows="3" placeholder="Enter reason for award or rejection feedback..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="targetAppForDecision = null">Cancel</button>
            <button class="btn btn-primary" (click)="confirmDecision()">Submit Formal Decision</button>
          </div>
        </div>
      </div>

      <!-- VIEW DETAIL MODAL -->
      <div class="modal-overlay" *ngIf="viewingApp" (click)="viewingApp = null">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <span class="badge" [ngClass]="'badge-' + viewingApp.applicationStatus.toLowerCase().replace('_', '-')">{{ viewingApp.applicationStatus }}</span>
              <h2 class="modal-title" style="margin-top: 6px;">{{ viewingApp.projectTitle }}</h2>
              <div class="code-badge">{{ viewingApp.applicationNumber }}</div>
            </div>
            <button class="btn btn-sm btn-outline" (click)="viewingApp = null">&times;</button>
          </div>

          <div class="modal-body">
            <div class="metrics-row">
              <div class="metric-card">
                <span class="m-label">Applicant Organization</span>
                <span class="m-val" style="font-size: 14px;">{{ viewingApp.organization?.orgName }}</span>
                <div style="font-size: 11px; color: #64748b;">{{ viewingApp.organization?.city }}, {{ viewingApp.organization?.state }}</div>
              </div>
              <div class="metric-card">
                <span class="m-label">Requested Grant</span>
                <span class="m-val">₹{{ viewingApp.requestedAmountInr | number }}</span>
                <div style="font-size: 11px; color: #64748b;">Duration: {{ viewingApp.projectDurationMonths }} mos</div>
              </div>
              <div class="metric-card">
                <span class="m-label">Approved Award</span>
                <span class="m-val" style="color: #16a34a;">{{ viewingApp.approvedAmountInr ? ('₹' + (viewingApp.approvedAmountInr | number)) : 'Pending' }}</span>
                <div style="font-size: 11px; color: #64748b;">Status: {{ viewingApp.applicationStatus }}</div>
              </div>
            </div>

            <h4 style="margin: 16px 0 6px 0;">Executive Summary:</h4>
            <p style="font-size: 13.5px; line-height: 1.6; color: #334155; background: #f8fafc; padding: 14px; border-radius: 6px;">
              {{ viewingApp.executiveSummary }}
            </p>

            <h4 style="margin: 16px 0 6px 0;">Statutory Eligibility Verification:</h4>
            <div style="font-size: 13px;">
              Status: <span class="badge" [ngClass]="'badge-' + viewingApp.eligibilityStatus.toLowerCase()">{{ viewingApp.eligibilityStatus }}</span>
              <p style="margin-top: 4px; color: #64748b;">{{ viewingApp.eligibilityRemarks }}</p>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="viewingApp = null">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .apps-page {
      width: 100%;
      max-width: 1180px;
    }

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
      flex-wrap: wrap;
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
      width: 300px;
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

    .sub-date {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }

    .org-name {
      font-weight: 600;
      color: #0f172a;
    }

    .applicant-meta {
      font-size: 11.5px;
      color: #64748b;
    }

    .project-title {
      font-weight: 600;
      color: #0f172a;
    }

    .scheme-name {
      font-size: 11.5px;
      color: #2563eb;
    }

    .inr-amount {
      font-size: 14px;
      color: #0f172a;
    }

    .approved-val {
      font-size: 11.5px;
      color: #16a34a;
      font-weight: 600;
    }

    .table-actions {
      display: flex;
      gap: 6px;
    }

    /* ELIGIBILITY CHECK PANEL IN SUBMIT MODAL */
    .submit-modal {
      max-width: 760px;
    }

    .eligibility-check-panel {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 16px;
      margin-top: 12px;
    }

    .check-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .check-result {
      margin-top: 14px;
      padding: 12px;
      border-radius: 6px;
    }

    .result-pass {
      background: #f0fdf4;
      border: 1px solid #86efac;
    }

    .result-fail {
      background: #fef2f2;
      border: 1px solid #fca5a5;
    }

    .result-summary {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .summary-text {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .criteria-results {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 6px;
    }

    .item-result {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12.5px;
    }

    .item-msg {
      color: #475569;
      margin-left: 4px;
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
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  publishedPrograms: GrantProgram[] = [];
  organizations: any[] = [];
  reviewers: any[] = [];
  selectedStatus = '';
  searchQuery = '';

  showSubmitModal = false;
  checkingEligibility = false;
  eligibilityResult: EligibilityResult | null = null;
  submittingApp = false;

  subForm: any = {
    programId: null,
    orgId: null,
    projectTitle: '',
    requestedAmountInr: 2500000,
    projectDurationMonths: 18,
    executiveSummary: ''
  };

  targetAppForAssign: Application | null = null;
  selectedReviewerId: number | null = null;

  targetAppForDecision: Application | null = null;
  decisionForm: any = {
    decision: 'APPROVED',
    approvedAmountInr: 0,
    remarks: 'Approved following technical committee review and budget assessment.'
  };

  viewingApp: Application | null = null;

  constructor(private grantService: GrantService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadApplications();
    this.loadPrograms();
    this.loadOrganizations();
    this.loadReviewers();
  }

  loadApplications(): void {
    this.grantService.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
      }
    });
  }

  loadPrograms(): void {
    this.grantService.getPrograms('PUBLISHED').subscribe({
      next: (data) => {
        this.publishedPrograms = data;
        if (data.length > 0 && !this.subForm.programId) {
          this.subForm.programId = data[0].programId;
        }
      }
    });
  }

  loadOrganizations(): void {
    this.grantService.getOrganizations().subscribe({
      next: (data) => {
        this.organizations = data;
        if (data.length > 0 && !this.subForm.orgId) {
          this.subForm.orgId = data[0].orgId;
        }
      }
    });
  }

  loadReviewers(): void {
    this.grantService.getReviewers().subscribe({
      next: (data) => {
        this.reviewers = data;
        if (data.length > 0) {
          this.selectedReviewerId = data[0].userId;
        }
      }
    });
  }

  get filteredApplications(): Application[] {
    return this.applications.filter(a => {
      const matchStatus = !this.selectedStatus || a.applicationStatus.toUpperCase() === this.selectedStatus.toUpperCase();
      const query = this.searchQuery.toLowerCase();
      const matchQuery = !query ||
        a.applicationNumber.toLowerCase().includes(query) ||
        a.projectTitle.toLowerCase().includes(query) ||
        (a.organization && a.organization.orgName.toLowerCase().includes(query));
      return matchStatus && matchQuery;
    });
  }

  filterStatus(status: string): void {
    this.selectedStatus = status;
  }

  openSubmitModal(): void {
    this.showSubmitModal = true;
    this.eligibilityResult = null;
  }

  onProgramSelect(): void {
    const prog = this.publishedPrograms.find(p => p.programId === this.subForm.programId);
    if (prog) {
      this.subForm.requestedAmountInr = prog.minAwardInr;
    }
  }

  runEligibilityCheck(): void {
    if (!this.subForm.programId) return;

    const org = this.organizations.find(o => o.orgId === this.subForm.orgId);
    this.checkingEligibility = true;

    this.grantService.checkEligibility({
      programId: this.subForm.programId,
      orgId: this.subForm.orgId,
      requestedAmountInr: this.subForm.requestedAmountInr,
      orgType: org ? org.orgType : 'NGO',
      establishedYear: org ? org.establishedYear : 2018,
      annualTurnoverInr: org ? org.annualTurnoverInr : 10000000,
      hasRegistrationDoc: true,
      hasDarpanId: true,
      hasAuditedFinancials: true
    }).subscribe({
      next: (result) => {
        this.checkingEligibility = false;
        this.eligibilityResult = result;
      },
      error: () => {
        this.checkingEligibility = false;
      }
    });
  }

  submitProposal(): void {
    if (!this.subForm.programId || !this.subForm.projectTitle || !this.subForm.requestedAmountInr) {
      alert('Please fill all mandatory proposal fields.');
      return;
    }

    this.submittingApp = true;
    this.grantService.submitApplication(this.subForm).subscribe({
      next: (saved) => {
        this.submittingApp = false;
        this.showSubmitModal = false;
        this.loadApplications();
        alert(`Application ${saved.applicationNumber} has been successfully submitted and stored in the database! Automated eligibility check status: ${saved.eligibilityStatus}.`);
      },
      error: (err) => {
        this.submittingApp = false;
        alert('Submission failed: ' + (err.error?.error || err.message));
      }
    });
  }

  openAssignModal(app: Application): void {
    this.targetAppForAssign = app;
  }

  confirmAssignReviewer(): void {
    if (!this.targetAppForAssign || !this.selectedReviewerId) return;
    this.grantService.assignReviewer(this.targetAppForAssign.applicationId, this.selectedReviewerId).subscribe({
      next: () => {
        this.targetAppForAssign = null;
        this.loadApplications();
        alert('Application has been successfully assigned to technical reviewer!');
      }
    });
  }

  openDecisionModal(app: Application): void {
    this.targetAppForDecision = app;
    this.decisionForm.approvedAmountInr = app.requestedAmountInr;
    this.decisionForm.decision = 'APPROVED';
  }

  confirmDecision(): void {
    if (!this.targetAppForDecision) return;
    this.grantService.decideApproval(this.targetAppForDecision.applicationId, this.decisionForm).subscribe({
      next: () => {
        this.targetAppForDecision = null;
        this.loadApplications();
        alert('Formal decision recorded in database! Disbursement tranches scheduled.');
      }
    });
  }

  viewAppDetails(app: Application): void {
    this.viewingApp = app;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrantService, Review } from '../../services/grant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-page">
      <div class="view-header">
        <div>
          <h1 class="page-title">Technical Review &amp; Evaluation</h1>
          <p class="page-desc">Independent peer assessments, scoring rubrics, and funding recommendations across 4 evaluation dimensions.</p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-pills">
          <button class="filter-pill" [class.active]="selectedFilter === ''" (click)="selectedFilter = ''">All Reviews ({{ reviews.length }})</button>
          <button class="filter-pill" [class.active]="selectedFilter === 'ASSIGNED'" (click)="selectedFilter = 'ASSIGNED'">Pending Action</button>
          <button class="filter-pill" [class.active]="selectedFilter === 'COMPLETED'" (click)="selectedFilter = 'COMPLETED'">Completed</button>
        </div>
        <input type="text" class="form-input search-input" [(ngModel)]="searchQuery" placeholder="Search proposal, applicant or reviewer...">
      </div>

      <!-- Reviews Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>App # &amp; Scheme</th>
              <th>Project Proposal</th>
              <th>Assigned Reviewer</th>
              <th>Evaluation Score</th>
              <th>Recommendation</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let rev of filteredReviews">
              <td>
                <strong class="code-badge">{{ rev.application.applicationNumber }}</strong>
                <div class="scheme-name">{{ rev.application.program.programName }}</div>
              </td>
              <td>
                <div class="proj-title">{{ rev.application.projectTitle }}</div>
                <div class="org-name">{{ rev.application.organization.orgName }} (₹{{ rev.application.requestedAmountInr | number }})</div>
              </td>
              <td>
                <div class="reviewer-name">{{ rev.reviewerUser?.fullName }}</div>
                <div class="reviewer-desig">{{ rev.reviewerUser?.designation }}</div>
              </td>
              <td>
                <div *ngIf="rev.totalScore !== null && rev.totalScore !== undefined" class="score-display">
                  <span class="score-num">{{ rev.totalScore }}</span>
                  <span class="score-max">/100</span>
                </div>
                <span *ngIf="rev.totalScore === null || rev.totalScore === undefined" class="text-muted">Awaiting</span>
              </td>
              <td>
                <span *ngIf="rev.recommendation" class="badge" [ngClass]="getRecBadge(rev.recommendation)">
                  {{ rev.recommendation }}
                </span>
                <span *ngIf="!rev.recommendation" class="text-muted">&mdash;</span>
              </td>
              <td>
                <span class="badge" [ngClass]="rev.reviewStatus === 'COMPLETED' ? 'badge-published' : 'badge-draft'">
                  {{ rev.reviewStatus }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-primary" (click)="openEvaluationModal(rev)">
                  {{ rev.reviewStatus === 'COMPLETED' ? 'View / Edit' : 'Evaluate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- EVALUATION & SCORING MODAL -->
      <div class="modal-overlay" *ngIf="scoringReview" (click)="scoringReview = null">
        <div class="modal-content scoring-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Proposal Scoring &amp; Technical Rubric</h2>
              <div class="modal-desc">
                {{ scoringReview.application.applicationNumber }} &bull; {{ scoringReview.application.projectTitle }}
              </div>
            </div>
            <button class="btn btn-sm btn-outline" (click)="scoringReview = null">&times;</button>
          </div>

          <div class="modal-body">
            <!-- 4 EVALUATION CRITERIA -->
            <div class="criteria-card">
              <div class="criterion-item">
                <div class="crit-header">
                  <div>
                    <strong>1. Technical Feasibility &amp; Methodology</strong>
                    <div class="crit-desc">Soundness of technical blueprint, milestones, risk mitigation, and timeline.</div>
                  </div>
                  <div class="crit-input-group">
                    <input type="number" min="0" max="30" class="form-input score-box" [(ngModel)]="rubric.s1" (input)="calcTotal()">
                    <span class="crit-max">/ 30 pts</span>
                  </div>
                </div>
              </div>

              <div class="criterion-item">
                <div class="crit-header">
                  <div>
                    <strong>2. Social &amp; Public Welfare Impact</strong>
                    <div class="crit-desc">Direct measurable welfare reach to vulnerable populations and economic additionality.</div>
                  </div>
                  <div class="crit-input-group">
                    <input type="number" min="0" max="30" class="form-input score-box" [(ngModel)]="rubric.s2" (input)="calcTotal()">
                    <span class="crit-max">/ 30 pts</span>
                  </div>
                </div>
              </div>

              <div class="criterion-item">
                <div class="crit-header">
                  <div>
                    <strong>3. Financial Cost Justification</strong>
                    <div class="crit-desc">Line-item budget realism, procurement transparency, and value for public expenditure.</div>
                  </div>
                  <div class="crit-input-group">
                    <input type="number" min="0" max="20" class="form-input score-box" [(ngModel)]="rubric.s3" (input)="calcTotal()">
                    <span class="crit-max">/ 20 pts</span>
                  </div>
                </div>
              </div>

              <div class="criterion-item">
                <div class="crit-header">
                  <div>
                    <strong>4. Organizational Pedigree &amp; Governance</strong>
                    <div class="crit-desc">Historical track record, audited compliance, project team expertise, and statutory standing.</div>
                  </div>
                  <div class="crit-input-group">
                    <input type="number" min="0" max="20" class="form-input score-box" [(ngModel)]="rubric.s4" (input)="calcTotal()">
                    <span class="crit-max">/ 20 pts</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TOTAL SCORE BANNER -->
            <div class="total-score-banner">
              <div>
                <span class="banner-label">Cumulative Evaluation Score:</span>
                <span class="banner-score">{{ rubric.totalScore }} / 100</span>
              </div>
              <div class="score-quality" [ngClass]="getScoreQualityClass()">
                {{ getScoreQualityLabel() }}
              </div>
            </div>

            <!-- RECOMMENDATION & REMARKS -->
            <div class="form-grid-2" style="margin-top: 18px;">
              <div class="form-group">
                <label class="form-label">Reviewer Recommendation <span class="required">*</span></label>
                <select class="form-select" [(ngModel)]="rubric.recommendation">
                  <option value="RECOMMENDED">RECOMMENDED For Grant Award</option>
                  <option value="RECOMMENDED_WITH_REVISIONS">RECOMMENDED With Revisions</option>
                  <option value="NOT_RECOMMENDED">NOT RECOMMENDED / Reject</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Evaluation Date</label>
                <input type="text" class="form-input" [value]="todayDate" disabled>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Detailed Technical Comments &amp; Justification <span class="required">*</span></label>
              <textarea 
                class="form-textarea" 
                [(ngModel)]="rubric.comments" 
                rows="4"
                placeholder="Detail technical strengths, equipment adequacy, risk flags, or required revisions for the grant committee..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="scoringReview = null">Cancel</button>
            <button class="btn btn-primary" (click)="submitEvaluation()" [disabled]="submittingScore">
              {{ submittingScore ? 'Submitting Evaluation...' : 'Submit Official Review' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-page {
      width: 100%;
      max-width: 1180px;
    }

    .view-header {
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
    }

    .filter-pill.active {
      background: #1e293b;
      color: #ffffff;
      border-color: #1e293b;
    }

    .search-input {
      width: 320px;
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

    .scheme-name {
      font-size: 11.5px;
      color: #2563eb;
    }

    .proj-title {
      font-weight: 600;
      color: #0f172a;
    }

    .org-name {
      font-size: 11.5px;
      color: #64748b;
    }

    .reviewer-name {
      font-weight: 600;
      color: #0f172a;
    }

    .reviewer-desig {
      font-size: 11.5px;
      color: #64748b;
    }

    .score-display {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .score-num {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
    }

    .score-max {
      font-size: 11px;
      color: #94a3b8;
    }

    /* SCORING MODAL */
    .scoring-modal {
      max-width: 740px;
    }

    .criteria-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .criterion-item {
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
    }

    .criterion-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .crit-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .crit-desc {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
      max-width: 480px;
    }

    .crit-input-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .score-box {
      width: 70px;
      text-align: center;
      font-size: 15px;
      font-weight: 700;
    }

    .crit-max {
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
    }

    .total-score-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      color: #ffffff;
      padding: 14px 20px;
      border-radius: 6px;
      margin-top: 14px;
    }

    .banner-label {
      font-size: 13px;
      opacity: 0.9;
    }

    .banner-score {
      display: block;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .score-quality {
      font-size: 13px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
    }

    .quality-high {
      background: #16a34a;
      color: #ffffff;
    }

    .quality-med {
      background: #d97706;
      color: #ffffff;
    }

    .quality-low {
      background: #dc2626;
      color: #ffffff;
    }
  `]
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  selectedFilter = '';
  searchQuery = '';

  scoringReview: Review | null = null;
  submittingScore = false;
  todayDate = new Date().toISOString().slice(0, 10);

  rubric = {
    s1: 25,
    s2: 26,
    s3: 16,
    s4: 17,
    totalScore: 84,
    recommendation: 'RECOMMENDED',
    comments: 'Strong implementation blueprint with verified baseline socioeconomic metrics.'
  };

  constructor(private grantService: GrantService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.grantService.getReviews().subscribe({
      next: (data) => {
        this.reviews = data;
      }
    });
  }

  get filteredReviews(): Review[] {
    return this.reviews.filter(r => {
      const matchFilter = !this.selectedFilter || r.reviewStatus === this.selectedFilter;
      const q = this.searchQuery.toLowerCase();
      const matchQuery = !q ||
        (r.application && r.application.applicationNumber.toLowerCase().includes(q)) ||
        (r.application && r.application.projectTitle.toLowerCase().includes(q)) ||
        (r.reviewerUser && r.reviewerUser.fullName.toLowerCase().includes(q));
      return matchFilter && matchQuery;
    });
  }

  getRecBadge(rec: string): string {
    if (rec === 'RECOMMENDED') return 'badge-published';
    if (rec === 'RECOMMENDED_WITH_REVISIONS') return 'badge-draft';
    return 'badge-closed';
  }

  openEvaluationModal(rev: Review): void {
    this.scoringReview = rev;
    if (rev.totalScore) {
      this.rubric.totalScore = rev.totalScore;
      this.rubric.s1 = Math.round(rev.totalScore * 0.3);
      this.rubric.s2 = Math.round(rev.totalScore * 0.3);
      this.rubric.s3 = Math.round(rev.totalScore * 0.2);
      this.rubric.s4 = rev.totalScore - this.rubric.s1 - this.rubric.s2 - this.rubric.s3;
      this.rubric.recommendation = rev.recommendation || 'RECOMMENDED';
      this.rubric.comments = rev.comments || '';
    } else {
      this.rubric = {
        s1: 24,
        s2: 25,
        s3: 16,
        s4: 17,
        totalScore: 82,
        recommendation: 'RECOMMENDED',
        comments: 'Technical proposal aligns well with scheme objectives and deliverables.'
      };
    }
  }

  calcTotal(): void {
    this.rubric.totalScore = Number(this.rubric.s1 || 0) + Number(this.rubric.s2 || 0) + Number(this.rubric.s3 || 0) + Number(this.rubric.s4 || 0);
  }

  getScoreQualityLabel(): string {
    if (this.rubric.totalScore >= 80) return 'High Merit (Recommended)';
    if (this.rubric.totalScore >= 65) return 'Medium Feasibility (Revisions)';
    return 'Low Feasibility (Not Recommended)';
  }

  getScoreQualityClass(): string {
    if (this.rubric.totalScore >= 80) return 'quality-high';
    if (this.rubric.totalScore >= 65) return 'quality-med';
    return 'quality-low';
  }

  submitEvaluation(): void {
    if (!this.scoringReview) return;
    this.submittingScore = true;

    const payload = {
      totalScore: this.rubric.totalScore,
      recommendation: this.rubric.recommendation,
      comments: this.rubric.comments,
      scores: [
        { criterionName: 'Technical Feasibility', maxScore: 30, assignedScore: this.rubric.s1, remarks: 'Methodology evaluation' },
        { criterionName: 'Social & Public Impact', maxScore: 30, assignedScore: this.rubric.s2, remarks: 'Community impact metrics' },
        { criterionName: 'Financial Justification', maxScore: 20, assignedScore: this.rubric.s3, remarks: 'Cost breakdown' },
        { criterionName: 'Organizational Capacity', maxScore: 20, assignedScore: this.rubric.s4, remarks: 'Execution capability' }
      ]
    };

    this.grantService.submitReview(this.scoringReview.reviewId, payload).subscribe({
      next: () => {
        this.submittingScore = false;
        this.scoringReview = null;
        this.loadReviews();
        alert('Official review evaluation and scoring stored in database successfully!');
      },
      error: (err) => {
        this.submittingScore = false;
        alert('Error saving review: ' + (err.error?.error || err.message));
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GrantService, DashboardMetrics } from '../../services/grant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <div class="view-header">
        <div>
          <h1 class="page-title">Executive Dashboard</h1>
          <p class="page-desc">High-level national overview of grant programs, active allocations, review workflows, and treasury disbursements.</p>
        </div>
        <div class="quick-actions">
          <a routerLink="/programs" class="btn btn-primary">+ Set up grant program</a>
          <a routerLink="/applications" class="btn btn-outline">+ Submit Proposal</a>
        </div>
      </div>

      <!-- 4 TOP METRICS CARDS -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-wrapper blue">🏛️</div>
          <div class="kpi-info">
            <span class="kpi-label">Total Public Budget Pool</span>
            <span class="kpi-val">₹{{ (metrics?.totalBudgetPoolInr || 0) | number }}</span>
            <span class="kpi-sub">{{ metrics?.totalPrograms || 0 }} schemes ({{ metrics?.activePrograms || 0 }} active)</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrapper green">📑</div>
          <div class="kpi-info">
            <span class="kpi-label">Allocated to Grants</span>
            <span class="kpi-val" style="color: #16a34a;">₹{{ (metrics?.totalAllocatedInr || 0) | number }}</span>
            <span class="kpi-sub">{{ metrics?.approvedApplications || 0 }} approved proposals</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrapper purple">💳</div>
          <div class="kpi-info">
            <span class="kpi-label">Treasury Disbursed (PFMS)</span>
            <span class="kpi-val" style="color: #2563eb;">₹{{ (metrics?.totalDisbursedInr || 0) | number }}</span>
            <span class="kpi-sub">{{ metrics?.disbursedApplications || 0 }} grants in active payout</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrapper amber">📊</div>
          <div class="kpi-info">
            <span class="kpi-label">Total Proposal Pipeline</span>
            <span class="kpi-val">{{ metrics?.totalApplications || 0 }}</span>
            <span class="kpi-sub">{{ metrics?.underReviewApplications || 0 }} under technical evaluation</span>
          </div>
        </div>
      </div>

      <!-- PIPELINE FUNNEL & CATEGORY DISTRIBUTION -->
      <div class="dashboard-grid-2">
        <!-- PIPELINE STATUS CARD -->
        <div class="card">
          <div class="card-header">
            <h3>Proposal Lifecycle Pipeline</h3>
            <span class="card-tag">End-to-End Workflow</span>
          </div>
          <div class="pipeline-flow">
            <div class="pipe-step">
              <span class="pipe-num">{{ metrics?.submittedApplications || 0 }}</span>
              <span class="pipe-name">Submitted</span>
              <div class="pipe-bar submitted" [style.width.%]="getPercent(metrics?.submittedApplications)"></div>
            </div>

            <div class="pipe-step">
              <span class="pipe-num">{{ metrics?.underReviewApplications || 0 }}</span>
              <span class="pipe-name">Under Review</span>
              <div class="pipe-bar review" [style.width.%]="getPercent(metrics?.underReviewApplications)"></div>
            </div>

            <div class="pipe-step">
              <span class="pipe-num">{{ metrics?.approvedApplications || 0 }}</span>
              <span class="pipe-name">Approved</span>
              <div class="pipe-bar approved" [style.width.%]="getPercent(metrics?.approvedApplications)"></div>
            </div>

            <div class="pipe-step">
              <span class="pipe-num">{{ metrics?.disbursedApplications || 0 }}</span>
              <span class="pipe-name">Disbursed</span>
              <div class="pipe-bar disbursed" [style.width.%]="getPercent(metrics?.disbursedApplications)"></div>
            </div>

            <div class="pipe-step">
              <span class="pipe-num">{{ metrics?.rejectedApplications || 0 }}</span>
              <span class="pipe-name">Rejected</span>
              <div class="pipe-bar rejected" [style.width.%]="getPercent(metrics?.rejectedApplications)"></div>
            </div>
          </div>
        </div>

        <!-- CATEGORY DISTRIBUTION CARD -->
        <div class="card">
          <div class="card-header">
            <h3>Sector &amp; Priority Distribution</h3>
            <span class="card-tag">Indian Public Focus Areas</span>
          </div>
          <div class="category-list">
            <div *ngFor="let cat of categoryList" class="cat-item">
              <div class="cat-header">
                <strong>{{ cat.name }}</strong>
                <span>{{ cat.count }} proposals ({{ cat.percent }}%)</span>
              </div>
              <div class="cat-bar">
                <div class="cat-fill" [style.width.%]="cat.percent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODULE WORKFLOW SHORTCUTS -->
      <div class="module-shortcuts-card">
        <h3>End-to-End Grants Workflow Navigation</h3>
        <div class="shortcut-grid">
          <a routerLink="/programs" class="shortcut-box">
            <span class="sc-icon">📁</span>
            <strong>1. Program Setup</strong>
            <span>Design schemes, total budget, award limits &amp; eligibility rules</span>
          </a>

          <a routerLink="/applications" class="shortcut-box">
            <span class="sc-icon">📝</span>
            <strong>2. Submissions &amp; Check</strong>
            <span>Automated real-time eligibility evaluation &amp; proposal intake</span>
          </a>

          <a routerLink="/reviews" class="shortcut-box">
            <span class="sc-icon">⭐</span>
            <strong>3. Review &amp; Scoring</strong>
            <span>4-criterion scored rubrics, evaluator comments &amp; recommendations</span>
          </a>

          <a routerLink="/disbursements" class="shortcut-box">
            <span class="sc-icon">💳</span>
            <strong>4. Fund Disbursements</strong>
            <span>Milestone tranches, PFMS electronic transfer &amp; bank UTRs</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
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

    .quick-actions {
      display: flex;
      gap: 10px;
    }

    /* KPI GRID */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .kpi-card {
      display: flex;
      gap: 14px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 18px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .kpi-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .blue { background: #e0f2fe; }
    .green { background: #dcfce7; }
    .purple { background: #f3e8ff; }
    .amber { background: #fef3c7; }

    .kpi-info {
      display: flex;
      flex-direction: column;
    }

    .kpi-label {
      font-size: 11.5px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
    }

    .kpi-val {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 2px 0;
    }

    .kpi-sub {
      font-size: 11.5px;
      color: #94a3b8;
    }

    /* 2-COL DASHBOARD GRID */
    .dashboard-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 22px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }

    .card-header h3 {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .card-tag {
      font-size: 11px;
      font-weight: 600;
      background: #f1f5f9;
      color: #475569;
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* PIPELINE FLOW */
    .pipeline-flow {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pipe-step {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .pipe-num {
      width: 28px;
      font-weight: 800;
      color: #0f172a;
      text-align: right;
    }

    .pipe-name {
      width: 90px;
      color: #475569;
      font-weight: 500;
    }

    .pipe-bar {
      flex: 1;
      height: 8px;
      border-radius: 4px;
      min-width: 12px;
    }

    .submitted { background: #0284c7; }
    .review { background: #d97706; }
    .approved { background: #16a34a; }
    .disbursed { background: #2563eb; }
    .rejected { background: #dc2626; }

    /* CATEGORIES */
    .category-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .cat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cat-header {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      color: #334155;
    }

    .cat-bar {
      height: 6px;
      background: #f1f5f9;
      border-radius: 3px;
      overflow: hidden;
    }

    .cat-fill {
      height: 100%;
      background: #1e293b;
    }

    /* SHORTCUTS */
    .module-shortcuts-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 22px;
    }

    .module-shortcuts-card h3 {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 14px;
    }

    .shortcut-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .shortcut-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .shortcut-box:hover {
      border-color: #2563eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .sc-icon {
      font-size: 20px;
      margin-bottom: 2px;
    }

    .shortcut-box strong {
      font-size: 13px;
      color: #0f172a;
    }

    .shortcut-box span {
      font-size: 11px;
      color: #64748b;
      line-height: 1.3;
    }
  `]
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics | null = null;
  categoryList: { name: string; count: number; percent: number }[] = [];

  constructor(private grantService: GrantService, public authService: AuthService) {}

  ngOnInit(): void {
    this.grantService.getDashboardMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.buildCategoryList(data);
      }
    });
  }

  getPercent(count?: number): number {
    if (!count || !this.metrics || !this.metrics.totalApplications) return 0;
    return Math.round((count / this.metrics.totalApplications) * 100);
  }

  private buildCategoryList(data: DashboardMetrics): void {
    const list: { name: string; count: number; percent: number }[] = [];
    if (data.applicationsByCategory) {
      const total = data.totalApplications || 1;
      for (const [key, val] of Object.entries(data.applicationsByCategory)) {
        list.push({
          name: key,
          count: val,
          percent: Math.round((val / total) * 100)
        });
      }
    }
    this.categoryList = list.sort((a, b) => b.count - a.count);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrantService } from '../../services/grant.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-page">
      <div class="view-header">
        <div>
          <h1 class="page-title">Monitoring, Utilization &amp; Audit Logs</h1>
          <p class="page-desc">Comprehensive statutory fund utilization reports, physical milestone progress, and immutable system audit trail.</p>
        </div>
      </div>

      <!-- TABS: PROGRESS REPORTS vs AUDIT TRAIL -->
      <div class="report-tabs">
        <button class="tab-btn" [class.active]="activeTab === 'utilization'" (click)="activeTab = 'utilization'">
          📋 Milestone Utilization Reports ({{ reports.length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'audit'" (click)="activeTab = 'audit'">
          🛡️ System Governance &amp; Audit Trail ({{ auditLogs.length }})
        </button>
      </div>

      <!-- TAB 1: PROGRESS & FUND UTILIZATION REPORTS -->
      <div *ngIf="activeTab === 'utilization'">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>App Number</th>
                <th>Report Title</th>
                <th>Physical Milestone Achieved</th>
                <th>Funds Utilized (INR)</th>
                <th>Submission Date</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of reports">
                <td>
                  <strong class="code-badge">{{ r.application?.applicationNumber }}</strong>
                  <div class="org-sub">{{ r.application?.organization?.orgName }}</div>
                </td>
                <td>
                  <strong class="rep-title">{{ r.reportTitle }}</strong>
                </td>
                <td>
                  <div class="milestone-desc">{{ r.milestoneAchieved }}</div>
                </td>
                <td>
                  <strong class="inr-amount" style="color: #16a34a;">₹{{ r.fundsUtilizedInr | number }}</strong>
                </td>
                <td>
                  <span class="date-text">{{ r.submissionDate }}</span>
                </td>
                <td>
                  <span class="badge badge-published">{{ r.status }}</span>
                  <div class="remarks-text" *ngIf="r.remarks">{{ r.remarks }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: AUDIT LOGS -->
      <div *ngIf="activeTab === 'audit'">
        <div class="audit-timeline">
          <div *ngFor="let log of auditLogs" class="audit-card">
            <div class="audit-icon">📌</div>
            <div class="audit-content">
              <div class="audit-meta">
                <span class="audit-action">{{ log.action }}</span> &bull;
                <span class="audit-entity">{{ log.entityName }} #{{ log.entityId }}</span> &bull;
                <span class="audit-user">{{ log.performedByUser?.fullName }} ({{ log.performedByUser?.designation }})</span>
                <span class="audit-time">{{ log.actionTimestamp ? (log.actionTimestamp | slice:0:19) : '' }}</span>
              </div>
              <div class="audit-details">{{ log.details }}</div>
              <div class="audit-transition" *ngIf="log.oldState && log.newState">
                State Transition: <code>{{ log.oldState }}</code> &rarr; <code>{{ log.newState }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page {
      width: 100%;
      max-width: 1180px;
    }

    .view-header {
      margin-bottom: 20px;
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

    .report-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 10px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .tab-btn:hover {
      color: #0f172a;
      background: #f1f5f9;
    }

    .tab-btn.active {
      color: #0f172a;
      background: #e2e8f0;
    }

    .code-badge {
      font-family: monospace;
      font-size: 12px;
      color: #1e293b;
    }

    .org-sub {
      font-size: 11px;
      color: #64748b;
    }

    .rep-title {
      color: #0f172a;
    }

    .milestone-desc {
      font-size: 12.5px;
      color: #334155;
      max-width: 360px;
      line-height: 1.4;
    }

    .remarks-text {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
    }

    /* AUDIT TIMELINE */
    .audit-timeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .audit-card {
      display: flex;
      gap: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
    }

    .audit-icon {
      font-size: 20px;
    }

    .audit-content {
      flex: 1;
    }

    .audit-meta {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;
    }

    .audit-action {
      font-weight: 700;
      color: #1e293b;
      background: #e2e8f0;
      padding: 1px 6px;
      border-radius: 3px;
    }

    .audit-user {
      color: #0f172a;
      font-weight: 600;
    }

    .audit-time {
      float: right;
      color: #94a3b8;
    }

    .audit-details {
      font-size: 13.5px;
      color: #334155;
      margin-top: 4px;
    }

    .audit-transition {
      font-size: 12px;
      color: #2563eb;
      margin-top: 6px;
    }

    code {
      background: #e0f2fe;
      padding: 1px 4px;
      border-radius: 3px;
    }
  `]
})
export class ReportsComponent implements OnInit {
  activeTab: 'utilization' | 'audit' = 'utilization';
  reports: any[] = [];
  auditLogs: any[] = [];

  constructor(private grantService: GrantService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.grantService.getProgressReports().subscribe({
      next: (data) => {
        this.reports = data;
      }
    });

    this.grantService.getAuditLogs().subscribe({
      next: (data) => {
        this.auditLogs = data;
      }
    });
  }
}

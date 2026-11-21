import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrantService, Disbursement } from '../../services/grant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-disbursements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="disb-page">
      <div class="view-header">
        <div>
          <h1 class="page-title">Grant Disbursements &amp; Treasury</h1>
          <p class="page-desc">Track scheduled award tranches, authorize fund releases via PFMS gateway, and verify bank UTR confirmations.</p>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">Total Tranches</span>
          <span class="stat-value">{{ disbursements.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Disbursed (INR)</span>
          <span class="stat-value" style="color: #16a34a;">₹{{ totalDisbursedAmount | number }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pending Releases</span>
          <span class="stat-value" style="color: #d97706;">{{ countByStatus('PENDING') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Cleared Payments</span>
          <span class="stat-value" style="color: #2563eb;">{{ countByStatus('DISBURSED') }}</span>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-pills">
          <button class="filter-pill" [class.active]="selectedStatus === ''" (click)="selectedStatus = ''">All Tranches</button>
          <button class="filter-pill" [class.active]="selectedStatus === 'PENDING'" (click)="selectedStatus = 'PENDING'">Pending</button>
          <button class="filter-pill" [class.active]="selectedStatus === 'DISBURSED'" (click)="selectedStatus = 'DISBURSED'">Disbursed</button>
        </div>
        <input type="text" class="form-input search-input" [(ngModel)]="searchQuery" placeholder="Search app #, org, or UTR number...">
      </div>

      <!-- Disbursements Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tranche #</th>
              <th>Proposal &amp; Beneficiary Org</th>
              <th>Milestone Deliverable</th>
              <th>Tranche Amount (INR)</th>
              <th>Scheduled Date</th>
              <th>Payment Status &amp; UTR</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of filteredDisbursements">
              <td>
                <span class="tranche-pill">Tranche {{ d.trancheNumber }}</span>
                <div class="code-badge" style="margin-top: 4px;">{{ d.application.applicationNumber }}</div>
              </td>
              <td>
                <div class="org-name">{{ d.application.organization.orgName }}</div>
                <div class="bank-details">
                  {{ d.application.organization.bankName }} &bull; A/C: {{ d.application.organization.bankAccountNumber }} &bull; IFSC: {{ d.application.organization.ifscCode }}
                </div>
              </td>
              <td>
                <div class="milestone-text">{{ d.milestoneDescription }}</div>
              </td>
              <td>
                <strong class="inr-amount">₹{{ d.amountInr | number }}</strong>
              </td>
              <td>
                <span class="date-text">{{ d.scheduledDate }}</span>
                <div *ngIf="d.disbursedDate" class="disb-date">Paid: {{ d.disbursedDate }}</div>
              </td>
              <td>
                <span class="badge" [ngClass]="d.paymentStatus === 'DISBURSED' ? 'badge-disbursed' : 'badge-draft'">
                  {{ d.paymentStatus }}
                </span>
                <div *ngIf="d.utrNumber" class="utr-badge" title="Bank Transaction Reference">
                  UTR: {{ d.utrNumber }}
                </div>
              </td>
              <td>
                <button 
                  class="btn btn-sm btn-primary" 
                  *ngIf="d.paymentStatus === 'PENDING'" 
                  (click)="openProcessModal(d)">
                  Release Fund
                </button>
                <button 
                  class="btn btn-sm btn-outline" 
                  *ngIf="d.paymentStatus === 'DISBURSED'" 
                  (click)="openProcessModal(d)">
                  View Receipt
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- RELEASE PAYMENT MODAL -->
      <div class="modal-overlay" *ngIf="targetDisb" (click)="targetDisb = null">
        <div class="modal-content process-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Authorize Public Fund Disbursement</h2>
              <div class="modal-desc">{{ targetDisb.application.applicationNumber }} &bull; Tranche #{{ targetDisb.trancheNumber }}</div>
            </div>
            <button class="btn btn-sm btn-outline" (click)="targetDisb = null">&times;</button>
          </div>

          <div class="modal-body">
            <div class="beneficiary-summary-card">
              <div class="ben-row">
                <span>Beneficiary:</span>
                <strong>{{ targetDisb.application.organization.orgName }}</strong>
              </div>
              <div class="ben-row">
                <span>Bank &amp; Account:</span>
                <strong>{{ targetDisb.application.organization.bankName }} &bull; {{ targetDisb.application.organization.bankAccountNumber }}</strong>
              </div>
              <div class="ben-row">
                <span>IFSC Code:</span>
                <strong>{{ targetDisb.application.organization.ifscCode }}</strong>
              </div>
              <div class="ben-row">
                <span>Disbursement Amount:</span>
                <strong style="color: #16a34a; font-size: 16px;">₹{{ targetDisb.amountInr | number }}</strong>
              </div>
              <div class="ben-row">
                <span>Milestone:</span>
                <div>{{ targetDisb.milestoneDescription }}</div>
              </div>
            </div>

            <div class="form-grid-2" style="margin-top: 18px;">
              <div class="form-group">
                <label class="form-label">Payment Status <span class="required">*</span></label>
                <select class="form-select" [(ngModel)]="processForm.paymentStatus">
                  <option value="DISBURSED">DISBURSED &mdash; Fund Transferred</option>
                  <option value="ON_HOLD">ON_HOLD &mdash; Verification Pending</option>
                  <option value="FAILED">FAILED &mdash; Rejection / Bank Return</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Disbursed Date <span class="required">*</span></label>
                <input type="date" class="form-input" [(ngModel)]="processForm.disbursedDate">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Bank UTR / Transaction Reference Number <span class="required">*</span></label>
              <input 
                type="text" 
                class="form-input" 
                [(ngModel)]="processForm.utrNumber" 
                placeholder="e.g. SBIN20261120008492">
              <span style="font-size: 11px; color: #64748b;">Enter Indian banking system RTGS/NEFT transaction identifier.</span>
            </div>

            <div class="form-group">
              <label class="form-label">Finance Authorization Remarks</label>
              <textarea 
                class="form-textarea" 
                [(ngModel)]="processForm.remarks" 
                rows="3" 
                placeholder="Enter audit approval remarks or voucher clearance notes..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="targetDisb = null">Cancel</button>
            <button class="btn btn-primary" (click)="confirmDisbursement()" [disabled]="processingPayment">
              {{ processingPayment ? 'Processing Authorization...' : 'Confirm Electronic Transfer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .disb-page {
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

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
    }

    .stat-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
    }

    .stat-value {
      display: block;
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 4px;
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

    .tranche-pill {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      background: #e0f2fe;
      color: #0369a1;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .code-badge {
      font-family: monospace;
      font-size: 12px;
      color: #1e293b;
    }

    .org-name {
      font-weight: 600;
      color: #0f172a;
    }

    .bank-details {
      font-size: 11px;
      color: #64748b;
    }

    .milestone-text {
      font-size: 12.5px;
      color: #334155;
      max-width: 280px;
    }

    .inr-amount {
      font-size: 14px;
      color: #0f172a;
    }

    .date-text {
      font-size: 12px;
      color: #475569;
    }

    .disb-date {
      font-size: 11px;
      color: #16a34a;
    }

    .utr-badge {
      font-family: monospace;
      font-size: 11px;
      color: #2563eb;
      margin-top: 4px;
    }

    .process-modal {
      max-width: 600px;
    }

    .beneficiary-summary-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13px;
    }

    .ben-row {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class DisbursementsComponent implements OnInit {
  disbursements: Disbursement[] = [];
  selectedStatus = '';
  searchQuery = '';

  targetDisb: Disbursement | null = null;
  processingPayment = false;

  processForm = {
    paymentStatus: 'DISBURSED',
    disbursedDate: new Date().toISOString().slice(0, 10),
    utrNumber: '',
    remarks: 'Electronic fund transfer authorized via PFMS public financial management system.'
  };

  constructor(private grantService: GrantService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadDisbursements();
  }

  loadDisbursements(): void {
    this.grantService.getDisbursements().subscribe({
      next: (data) => {
        this.disbursements = data;
      }
    });
  }

  get totalDisbursedAmount(): number {
    return this.disbursements
      .filter(d => d.paymentStatus === 'DISBURSED')
      .reduce((sum, d) => sum + Number(d.amountInr || 0), 0);
  }

  countByStatus(status: string): number {
    return this.disbursements.filter(d => d.paymentStatus === status).length;
  }

  get filteredDisbursements(): Disbursement[] {
    return this.disbursements.filter(d => {
      const matchStatus = !this.selectedStatus || d.paymentStatus === this.selectedStatus;
      const q = this.searchQuery.toLowerCase();
      const matchQuery = !q ||
        (d.application && d.application.applicationNumber.toLowerCase().includes(q)) ||
        (d.application && d.application.organization && d.application.organization.orgName.toLowerCase().includes(q)) ||
        (d.utrNumber && d.utrNumber.toLowerCase().includes(q));
      return matchStatus && matchQuery;
    });
  }

  openProcessModal(d: Disbursement): void {
    this.targetDisb = d;
    this.processForm.paymentStatus = 'DISBURSED';
    this.processForm.disbursedDate = new Date().toISOString().slice(0, 10);
    this.processForm.utrNumber = d.utrNumber || ('SBIN' + new Date().getFullYear() + String(Math.floor(100000 + Math.random() * 900000)));
    this.processForm.remarks = d.remarks || 'Cleared by Treasury Joint Controller of Accounts.';
  }

  confirmDisbursement(): void {
    if (!this.targetDisb) return;
    this.processingPayment = true;

    this.grantService.processDisbursement(this.targetDisb.disbursementId, this.processForm).subscribe({
      next: (res) => {
        this.processingPayment = false;
        this.targetDisb = null;
        this.loadDisbursements();
        alert(`Disbursement confirmed! UTR ${res.utrNumber} saved and program disbursed budget updated in database.`);
      },
      error: (err) => {
        this.processingPayment = false;
        alert('Error processing disbursement: ' + (err.error?.error || err.message));
      }
    });
  }
}

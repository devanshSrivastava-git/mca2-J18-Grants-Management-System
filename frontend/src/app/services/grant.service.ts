import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface GrantProgram {
  programId: number;
  programCode: string;
  programName: string;
  category: string;
  description: string;
  totalBudgetInr: number;
  allocatedBudgetInr: number;
  disbursedBudgetInr: number;
  minAwardInr: number;
  maxAwardInr: number;
  opensAt: string;
  closesAt: string;
  status: string; // DRAFT, PUBLISHED, CLOSED, ARCHIVED
  createdBy?: any;
  criteria?: ProgramCriterion[];
  createdAt?: string;
}

export interface ProgramCriterion {
  criteriaId?: number;
  criterionType: string;
  criterionName: string;
  criterionValue: string;
  isMandatory: number;
}

export interface Application {
  applicationId: number;
  applicationNumber: string;
  program: GrantProgram;
  applicantUser: any;
  organization: any;
  projectTitle: string;
  executiveSummary: string;
  requestedAmountInr: number;
  approvedAmountInr?: number;
  projectDurationMonths: number;
  eligibilityStatus: string;
  eligibilityRemarks?: string;
  applicationStatus: string;
  submissionDate?: string;
  approvalDate?: string;
  documents?: any[];
  createdAt: string;
}

export interface EligibilityCheckRequest {
  programId: number;
  orgId?: number;
  requestedAmountInr: number;
  orgType: string;
  establishedYear: number;
  annualTurnoverInr: number;
  hasRegistrationDoc: boolean;
  hasDarpanId?: boolean;
  hasAuditedFinancials?: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  status: string;
  summary: string;
  details: {
    criterionName: string;
    passed: boolean;
    message: string;
  }[];
}

export interface Review {
  reviewId: number;
  application: Application;
  reviewerUser: any;
  assignedDate: string;
  completedDate?: string;
  totalScore?: number;
  recommendation?: string;
  comments?: string;
  reviewStatus: string;
  scores?: any[];
}

export interface Disbursement {
  disbursementId: number;
  application: Application;
  trancheNumber: number;
  amountInr: number;
  milestoneDescription: string;
  scheduledDate: string;
  disbursedDate?: string;
  paymentStatus: string; // PENDING, PROCESSING, DISBURSED, ON_HOLD, FAILED
  utrNumber?: string;
  disbursedByUser?: any;
  remarks?: string;
}

export interface DashboardMetrics {
  totalPrograms: number;
  activePrograms: number;
  totalApplications: number;
  submittedApplications: number;
  underReviewApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  disbursedApplications: number;
  totalBudgetPoolInr: number;
  totalAllocatedInr: number;
  totalDisbursedInr: number;
  applicationsByCategory: { [key: string]: number };
  applicationsByStatus: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class GrantService {
  private baseUrl = '/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get headers() {
    return { headers: this.authService.getAuthHeaders() };
  }

  // Grant Programs
  getPrograms(status?: string): Observable<GrantProgram[]> {
    const url = status ? `${this.baseUrl}/programs?status=${status}` : `${this.baseUrl}/programs`;
    return this.http.get<GrantProgram[]>(url);
  }

  getProgram(id: number): Observable<GrantProgram> {
    return this.http.get<GrantProgram>(`${this.baseUrl}/programs/${id}`);
  }

  createProgram(program: any): Observable<GrantProgram> {
    return this.http.post<GrantProgram>(`${this.baseUrl}/programs`, program, this.headers);
  }

  updateProgramStatus(id: number, status: string): Observable<GrantProgram> {
    return this.http.patch<GrantProgram>(`${this.baseUrl}/programs/${id}/status`, { status }, this.headers);
  }

  // Applications
  getApplications(programId?: number, status?: string): Observable<Application[]> {
    let url = `${this.baseUrl}/applications`;
    const params: string[] = [];
    if (programId) params.push(`programId=${programId}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get<Application[]>(url, this.headers);
  }

  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/applications/my`, this.headers);
  }

  getApplication(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.baseUrl}/applications/${id}`, this.headers);
  }

  submitApplication(data: any): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/applications`, data, this.headers);
  }

  decideApproval(applicationId: number, decision: any): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/applications/${applicationId}/decision`, decision, this.headers);
  }

  // Eligibility Verification Engine
  checkEligibility(data: EligibilityCheckRequest): Observable<EligibilityResult> {
    return this.http.post<EligibilityResult>(`${this.baseUrl}/eligibility/check`, data);
  }

  // Reviews Workflow
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews`, this.headers);
  }

  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews/my`, this.headers);
  }

  assignReviewer(applicationId: number, reviewerUserId: number): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/reviews/assign`, { applicationId, reviewerUserId }, this.headers);
  }

  submitReview(reviewId: number, reviewData: any): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/reviews/${reviewId}/submit`, reviewData, this.headers);
  }

  // Disbursements & Financials
  getDisbursements(status?: string): Observable<Disbursement[]> {
    const url = status ? `${this.baseUrl}/disbursements?status=${status}` : `${this.baseUrl}/disbursements`;
    return this.http.get<Disbursement[]>(url, this.headers);
  }

  processDisbursement(disbursementId: number, data: any): Observable<Disbursement> {
    return this.http.post<Disbursement>(`${this.baseUrl}/disbursements/${disbursementId}/process`, data, this.headers);
  }

  getProgressReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/disbursements/reports`, this.headers);
  }

  // Reports & Analytics
  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.baseUrl}/reports/dashboard`);
  }

  getAuditLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reports/audit-logs`, this.headers);
  }

  // Organizations & Reviewers
  getOrganizations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/organizations`, this.headers);
  }

  getReviewers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/organizations/reviewers`, this.headers);
  }
}

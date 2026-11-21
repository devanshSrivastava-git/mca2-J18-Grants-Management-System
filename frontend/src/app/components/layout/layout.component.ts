import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, UserSession } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <!-- TOP NAVIGATION BAR -->
      <header class="topbar">
        <div class="topbar-left">
          <a routerLink="/programs" class="brand">
            <span class="brand-text">GRANT / TRACK</span>
          </a>
          <span class="gov-badge">National Portal &bull; Government of India</span>
        </div>

        <div class="topbar-right">
          <!-- Persona quick switcher for reviewers/evaluators -->
          <div class="persona-switch">
            <span class="switch-label">Role Persona:</span>
            <button 
              class="persona-btn" 
              [class.active]="currentUser?.username === 'pm_rajesh'" 
              (click)="switchPersona('pm_rajesh')"
              title="Program Manager: Setup programs, oversee review & approve awards">
              Program Manager
            </button>
            <button 
              class="persona-btn" 
              [class.active]="currentUser?.username === 'admin'" 
              (click)="switchPersona('admin')"
              title="Chief Administrator: Full system oversight & DDL config">
              Admin
            </button>
            <button 
              class="persona-btn" 
              [class.active]="currentUser?.username === 'rev_ananya'" 
              (click)="switchPersona('rev_ananya')"
              title="Technical Reviewer: Score proposals & submit recommendations">
              Reviewer
            </button>
            <button 
              class="persona-btn" 
              [class.active]="currentUser?.username === 'app_vikram'" 
              (click)="switchPersona('app_vikram')"
              title="Applicant: Check eligibility & submit proposals">
              Applicant
            </button>
            <button 
              class="persona-btn" 
              [class.active]="currentUser?.username === 'fin_neha'" 
              (click)="switchPersona('fin_neha')"
              title="Finance Officer: Authorize disbursements & issue UTR">
              Finance
            </button>
          </div>

          <div class="topbar-divider"></div>

          <div class="topbar-links">
            <span class="user-display">
              <span class="user-role-badge">{{ getUserRoleLabel() }}</span>
              {{ currentUser?.fullName || 'Program manager' }}
            </span>
            <span class="sep">|</span>
            <a href="javascript:void(0)" (click)="showHelp = !showHelp" class="nav-link">Help</a>
            <span class="sep">|</span>
            <a routerLink="/login" class="nav-link">Account</a>
          </div>
        </div>
      </header>

      <!-- HELP MODAL -->
      <div class="modal-overlay" *ngIf="showHelp" (click)="showHelp = false">
        <div class="modal-content help-modal" (click)="$event.stopPropagation()">
          <div class="help-header">
            <h3>Grants Management System &mdash; Architecture & Guide</h3>
            <button class="btn btn-sm btn-outline" (click)="showHelp = false">&times;</button>
          </div>
          <div class="help-body">
            <h4>Technology Stack</h4>
            <p><strong>Backend:</strong> Java 17, Spring Boot 3.3.5, Hibernate/JPA, REST APIs, Spring Security 6 with JWT tokens, Oracle 21c XE DDL & persistent store.</p>
            <p><strong>Database:</strong> Normalized 3NF schema (13 tables, complete PK/FK constraints, Oracle NUMBER & VARCHAR2 syntax, seed dataset with 60 applications, 80 tranches in Indian context).</p>
            <p><strong>Frontend:</strong> Angular 21, TypeScript, Responsive CSS matching Government public portal wireframe.</p>
            <h4 style="margin-top: 14px;">Key Module Workflows</h4>
            <ul>
              <li><strong>1. Grant Program Setup:</strong> Matches wireframe stepper (Details &rarr; Eligibility &rarr; Form &rarr; Publish) with INR amounts and limits.</li>
              <li><strong>2. Application Submission & Eligibility Engine:</strong> Evaluates org type, operational years, turnover limits, and generates proposal numbers.</li>
              <li><strong>3. Review & Approval:</strong> Scored evaluation (0-100) across 4 dimensions, committee approval, and automatic tranche creation.</li>
              <li><strong>4. Disbursements & Reports:</strong> PFMS-compliant bank UTR issuance, milestone tracking, and dashboard reporting.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- MAIN APP BODY -->
      <div class="shell-body">
        <!-- SIDEBAR -->
        <aside class="sidebar">
          <div class="sidebar-section-title">WORKSPACE</div>
          <nav class="sidebar-nav">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📊</span>
              Dashboard
            </a>
            <a routerLink="/programs" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📁</span>
              Programs
            </a>
            <a routerLink="/applications" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📝</span>
              Applications
            </a>
            <a routerLink="/reviews" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">⭐</span>
              Reviews
            </a>
            <a routerLink="/disbursements" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">💳</span>
              Disbursements
            </a>
            <a routerLink="/reports" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📈</span>
              Reports
            </a>
          </nav>

          <div class="sidebar-bottom">
            <a href="javascript:void(0)" class="bottom-link">
              <span class="nav-icon">⚙️</span>
              Organization settings
            </a>
          </div>
        </aside>

        <!-- CONTENT VIEW -->
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #ffffff;
    }

    /* TOPBAR - FIXED AT VERY TOP OF ALL PAGES */
    .topbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 58px;
      padding: 0 28px;
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand {
      font-size: 19px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #0f172a;
    }

    .gov-badge {
      font-size: 11px;
      font-weight: 500;
      color: #0369a1;
      background: #e0f2fe;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .persona-switch {
      display: flex;
      align-items: center;
      background: #f1f5f9;
      padding: 3px 4px;
      border-radius: 6px;
      gap: 4px;
    }

    .switch-label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      margin: 0 4px;
      text-transform: uppercase;
    }

    .persona-btn {
      font-size: 11.5px;
      padding: 4px 9px;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: #475569;
      font-weight: 500;
      transition: all 0.15s ease;
    }

    .persona-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .persona-btn.active {
      background: #1e293b;
      color: #ffffff;
      font-weight: 600;
    }

    .topbar-divider {
      width: 1px;
      height: 24px;
      background-color: #e2e8f0;
    }

    .topbar-links {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13.5px;
      color: #334155;
    }

    .user-display {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }

    .user-role-badge {
      font-size: 10px;
      font-weight: 700;
      background: #dbeafe;
      color: #1d4ed8;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .sep {
      color: #cbd5e1;
    }

    .nav-link {
      color: #475569;
      text-decoration: none;
    }

    .nav-link:hover {
      color: #0f172a;
      text-decoration: underline;
    }

    /* BODY */
    .shell-body {
      display: flex;
      width: 100%;
      min-height: calc(100vh - 58px);
      margin-top: 58px; /* Offset for fixed topbar */
    }

    /* SIDEBAR - PERMANENTLY PINNED AT TOP-LEFT FOR ALL PAGES */
    .sidebar {
      position: fixed;
      top: 58px; /* Fixed right below topbar */
      left: 0;
      bottom: 0;
      width: 230px;
      background-color: #ffffff;
      border-right: 1px solid #e2e8f0;
      padding: 24px 0 16px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 900;
      box-sizing: border-box;
      overflow-y: auto;
    }

    .sidebar-section-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.8px;
      padding: 0 20px 12px 20px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 20px;
      font-size: 14px;
      font-weight: 500;
      color: #334155;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .nav-item:hover {
      background-color: #f8fafc;
      color: #0f172a;
    }

    .nav-item.active {
      background-color: #e2e8f0;
      color: #0f172a;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 15px;
    }

    .sidebar-bottom {
      padding: 16px 20px 0 20px;
      border-top: 1px solid #f1f5f9;
    }

    .bottom-link {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: #64748b;
      text-decoration: none;
    }

    .bottom-link:hover {
      color: #0f172a;
    }

    /* MAIN CONTENT - FIXED LEFT OFFSET FOR ALL PAGES */
    .content-area {
      flex: 1;
      margin-left: 230px; /* Exact fixed width of sidebar */
      padding: 32px 48px;
      background-color: #ffffff;
      min-height: calc(100vh - 58px);
      box-sizing: border-box;
      width: calc(100% - 230px);
      max-width: calc(100vw - 230px);
      overflow-x: auto;
    }

    /* HELP MODAL */
    .help-modal {
      max-width: 650px;
    }
    .help-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .help-body {
      font-size: 13.5px;
      line-height: 1.6;
      color: #334155;
    }
    .help-body h4 {
      color: #0f172a;
      margin-bottom: 4px;
    }
    .help-body ul {
      margin-left: 20px;
      margin-top: 6px;
    }
  `]
})
export class LayoutComponent {
  currentUser: UserSession | null = null;
  showHelp = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  switchPersona(username: string): void {
    this.authService.quickLogin(username).subscribe({
      next: (user) => {
        console.log('Switched to persona:', user.username);
      }
    });
  }

  getUserRoleLabel(): string {
    if (!this.currentUser || !this.currentUser.roles || this.currentUser.roles.length === 0) {
      return 'User';
    }
    const r = this.currentUser.roles[0];
    if (r === 'ROLE_ADMIN') return 'Admin';
    if (r === 'ROLE_PROGRAM_MANAGER') return 'Program Manager';
    if (r === 'ROLE_REVIEWER') return 'Reviewer';
    if (r === 'ROLE_APPLICANT') return 'Applicant';
    if (r === 'ROLE_FINANCE_OFFICER') return 'Finance Officer';
    return r.replace('ROLE_', '');
  }
}

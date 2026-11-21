import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="brand-title">GRANT / TRACK</div>
          <div class="portal-badge">National Grants Management Portal &bull; Government of India</div>
          <p class="login-desc">Sign in with your official credentials to manage programs, evaluate proposals, or track public fund disbursements.</p>
        </div>

        <div class="alert alert-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Username / Official ID *</label>
            <input 
              type="text" 
              class="form-input" 
              [(ngModel)]="username" 
              name="username" 
              placeholder="e.g. pm_rajesh or admin"
              required>
          </div>

          <div class="form-group">
            <label class="form-label">Password *</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="Enter password"
              required>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
            {{ loading ? 'Authenticating...' : 'Sign In to Portal' }}
          </button>
        </form>

        <div class="quick-login-section">
          <div class="quick-title">Quick Demo Logins (Click any persona):</div>
          <div class="persona-grid">
            <button class="persona-card" (click)="quickLogin('pm_rajesh')">
              <span class="persona-icon">📋</span>
              <div class="persona-info">
                <strong>Rajesh Sharma</strong>
                <span>Grant Program Manager</span>
              </div>
            </button>

            <button class="persona-card" (click)="quickLogin('admin')">
              <span class="persona-icon">👑</span>
              <div class="persona-info">
                <strong>Dr. Rajeshwar Sharma</strong>
                <span>System Administrator</span>
              </div>
            </button>

            <button class="persona-card" (click)="quickLogin('rev_ananya')">
              <span class="persona-icon">🔍</span>
              <div class="persona-info">
                <strong>Prof. Ananya Sengupta</strong>
                <span>Technical Reviewer</span>
              </div>
            </button>

            <button class="persona-card" (click)="quickLogin('app_vikram')">
              <span class="persona-icon">🏢</span>
              <div class="persona-info">
                <strong>Vikram Seth</strong>
                <span>Aarogya NGO Applicant</span>
              </div>
            </button>

            <button class="persona-card" (click)="quickLogin('fin_neha')">
              <span class="persona-icon">💳</span>
              <div class="persona-info">
                <strong>Neha Verma</strong>
                <span>Public Finance Officer</span>
              </div>
            </button>
          </div>
          <p class="quick-hint">Default password for all demo accounts: <code>password123</code></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 24px;
    }

    .login-card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-width: 520px;
      padding: 40px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #0f172a;
    }

    .portal-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      color: #0369a1;
      background: #e0f2fe;
      padding: 3px 10px;
      border-radius: 12px;
      margin-top: 6px;
    }

    .login-desc {
      font-size: 13.5px;
      color: #64748b;
      margin-top: 12px;
    }

    .btn-block {
      width: 100%;
      padding: 11px;
      font-size: 14.5px;
      font-weight: 600;
      margin-top: 8px;
    }

    .alert-error {
      background: #fee2e2;
      border: 1px solid #f87171;
      color: #b91c1c;
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 18px;
    }

    .quick-login-section {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .quick-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 12px;
    }

    .persona-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 8px;
    }

    .persona-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      text-align: left;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .persona-card:hover {
      background: #e2e8f0;
      border-color: #cbd5e1;
    }

    .persona-icon {
      font-size: 18px;
    }

    .persona-info strong {
      display: block;
      font-size: 12.5px;
      color: #0f172a;
    }

    .persona-info span {
      display: block;
      font-size: 11px;
      color: #64748b;
    }

    .quick-hint {
      font-size: 11.5px;
      color: #94a3b8;
      text-align: center;
      margin-top: 12px;
    }

    code {
      background: #f1f5f9;
      padding: 2px 4px;
      border-radius: 3px;
      color: #0f172a;
    }
  `]
})
export class LoginComponent {
  username = 'pm_rajesh';
  password = 'password123';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/programs']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Invalid credentials or connection issue';
      }
    });
  }

  quickLogin(uname: string): void {
    this.username = uname;
    this.password = 'password123';
    this.onSubmit();
  }
}

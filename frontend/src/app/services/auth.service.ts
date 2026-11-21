import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface UserSession {
  token: string;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  designation: string;
  organizationId?: number;
  organizationName?: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<UserSession | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('gms_user_session');
    if (saved) {
      try {
        this.currentUserSubject.next(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('gms_user_session');
      }
    } else {
      // Default to Program Manager (Rajesh Sharma) as in the wireframe
      this.quickLogin('pm_rajesh', 'password123').subscribe();
    }
  }

  public get currentUserValue(): UserSession | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<UserSession> {
    return this.http.post<UserSession>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(session => {
        localStorage.setItem('gms_user_session', JSON.stringify(session));
        this.currentUserSubject.next(session);
      })
    );
  }

  quickLogin(username: string, password: string = 'password123'): Observable<UserSession> {
    return this.login(username, password);
  }

  logout(): void {
    localStorage.removeItem('gms_user_session');
    this.currentUserSubject.next(null);
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    if (!user || !user.roles) return false;
    return user.roles.includes(role) || user.roles.includes('ROLE_ADMIN');
  }

  getAuthHeaders(): { [header: string]: string } {
    const user = this.currentUserValue;
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  }
}

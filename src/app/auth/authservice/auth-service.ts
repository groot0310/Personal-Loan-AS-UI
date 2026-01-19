import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError, timeout } from 'rxjs';

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
  gender:string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8080/api/auth';

   private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
     this.loadUserFromStorage();
  }

  login(email: string, password: string) {
    return this.http
      .post<{
        userProfile: any;
        token: string;
      }>(`${this.API}/login`, { email, password })
      .pipe(
        timeout(5000), // ⏱️ FAIL FAST (5 sec)
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
          localStorage.setItem('userProfile', JSON.stringify(res.userProfile));
        this.userSubject.next(res.userProfile);

        }),
        catchError((err) => throwError(() => err))
      );
  }

    getUser(): UserProfile | null {
    return this.userSubject.value;
  }

  private loadUserFromStorage() {
    const user = localStorage.getItem('userProfile');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API}/register`, data);
  }

  logout() {
  // localStorage.removeItem('token');   // ✅ MUST
  localStorage.removeItem('email');
  localStorage.removeItem('password');
  localStorage.removeItem('userProfile');

  this.userSubject.next(null);
}


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

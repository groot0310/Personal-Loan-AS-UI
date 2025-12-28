import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

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
        }),
        catchError((err) => throwError(() => err))
      );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API}/register`, data);
  }

  logout() {
    // localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

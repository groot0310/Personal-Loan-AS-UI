import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
  return this.http.post<{ token: string }>(this.API, { email, password }).pipe(
    timeout(1000), // ⏱️ FAIL FAST (5 sec)
    tap(res => localStorage.setItem('token', res.token)),
    catchError(err => throwError(() => err))
  );
}

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminRoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // TEMP: mock role (later from auth service / JWT)
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}

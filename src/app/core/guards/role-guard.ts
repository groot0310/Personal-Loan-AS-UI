import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = 'USER'; // later from token
    const allowed = route.data['roles'] as string[];

    if (!allowed.includes(role)) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}

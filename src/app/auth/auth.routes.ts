// src/app/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from '../auth/guard/auth-guard-guard';

export const AUTH_ROUTES: Routes = [
  { path: 'user/dashboard',
    loadComponent: () =>
      import('../admin/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]},
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];

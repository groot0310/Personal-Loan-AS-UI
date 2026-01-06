import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../auth/authservice/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
})
export class HeaderComponent {
  user: UserProfile | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

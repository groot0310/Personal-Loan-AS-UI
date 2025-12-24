import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../authservice/auth-service';

@Component({
  standalone: true,
  styleUrls: ['./login.component.css'],
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './login.html',
})
export class Login {
   loginForm: FormGroup;
  showPassword = false;
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private router: Router,  private authService: AuthService,) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/user/dashboard']); // protected route
      },
      error: (err) => {
        this.loading = false;
           if (err.name === 'TimeoutError') {
        this.errorMessage = 'Server not responding. Try again.';
      } else if (err.status === 401) {
        this.errorMessage = 'Invalid email or password';
      } else {
        this.errorMessage = 'Something went wrong';
      }
      }
    });
  }
}

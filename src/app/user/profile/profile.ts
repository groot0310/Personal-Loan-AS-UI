import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-user-profile',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.html',
})
export class UserProfile {
  user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
  };
}

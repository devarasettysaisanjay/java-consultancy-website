import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: any = {
    fullName: '',
    email: '',
    gender: '',
    countryCode: '+91',
    whatsapp: ''
  };

  register(): void {

    if (
      !this.user.fullName ||
      !this.user.email ||
      !this.user.gender ||
      !this.user.whatsapp
    ) {
      alert('Please fill all required fields');
      return;
    }

    console.log('Registration Data:', this.user);

    alert('Registration successful');
  }
}
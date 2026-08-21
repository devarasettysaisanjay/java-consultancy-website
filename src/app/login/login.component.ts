import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  };

  constructor() {}

  login(): void {

    console.log('Email:', this.loginData.email);
    console.log('Password:', this.loginData.password);

    if (!this.loginData.email || !this.loginData.password) {
      alert('Please enter email and password');
      return;
    }

    // Connect your Spring Boot API here
    //
    // Example:
    //
    // this.api.login(this.loginData).subscribe({
    //
    //   next: (response) => {
    //     console.log(response);
    //     this.router.navigate(['/dashboard']);
    //   },
    //
    //   error: (error) => {
    //     alert('Invalid email or password');
    //   }
    //
    // });
  }

}

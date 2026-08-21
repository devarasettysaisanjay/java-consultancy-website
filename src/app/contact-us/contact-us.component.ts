import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
 form = {
    name: '',
    email: '',
    code: '+91',
    phone: '',
    message: ''
  };

  submitForm(): void {

    if (
      !this.form.name ||
      !this.form.email ||
      !this.form.phone ||
      !this.form.message
    ) {
      alert('Please fill all required fields.');
      return;
    }

    console.log('Contact Form Data:', this.form);

    alert('Thank you! Your message has been submitted.');

    this.form = {
      name: '',
      email: '',
      code: '+91',
      phone: '',
      message: ''
    };
  }
}

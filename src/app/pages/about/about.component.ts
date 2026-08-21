import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {


  constructor(private router: Router){

  }

   goToEnquiry(): void {
    this.router.navigate(['/enquiry']);
  }


   goToCourses(): void {
    this.router.navigate(['/courses']);
  }
}

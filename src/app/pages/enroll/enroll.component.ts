import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSES } from 'src/app/data/courses';
import { Course } from 'src/app/models/course.model';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css']
})
export class EnrollComponent {
course!: Course;

  student = {
    fullName: '',
    email: '',
    mobile: '',
    experience: '',
    currentStatus: '',
    howFoundUs: '',
    message: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const slug =
      this.route.snapshot.paramMap.get('slug');

    this.course = COURSES.find(
      c => c.slug === slug
    )!;

  }

  proceedToPayment(): void {

    console.log(this.student);

    this.router.navigate([
      '/payment-success'
    ]);

  }
}

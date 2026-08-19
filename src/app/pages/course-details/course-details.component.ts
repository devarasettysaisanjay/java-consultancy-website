import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSES } from 'src/app/data/courses';
import { Course } from 'src/app/models/course.model';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {

  course: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("hi");

    const slug = this.route.snapshot.paramMap.get('slug');
      console.log("Slug ", slug);

    this.course = COURSES.find(
      course => course.slug === slug
    );

    console.log('Selected Course:', this.course);
  }

  enroll(): void {

    if (this.course) {

      this.router.navigate([
        '/enroll',
        this.course.slug
      ]);

    }

  }
}

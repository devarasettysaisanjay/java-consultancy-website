import { Component, OnInit } from '@angular/core';
import { COURSES } from 'src/app/data/courses';
import { Course } from 'src/app/models/course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit{
 ngOnInit(): void {
  console.log("test");
 }
 courses: Course[] = COURSES;

  
}

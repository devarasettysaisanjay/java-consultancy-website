import { Component } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {
enrolledCourses = 3;

  upcomingClasses = 4;

  completedCourses = 1;

  certificates = 1;

  courses = [

    {
      name: 'Core Java',
      progress: 65
    },

    {
      name: 'Spring Boot',
      progress: 30
    },

    {
      name: 'Microservices',
      progress: 10
    }

  ];
}

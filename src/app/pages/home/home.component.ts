import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SERVICES } from 'src/app/data/services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
 services = SERVICES;

  constructor(
    private title: Title,
    private meta: Meta
  ) {}

   ngOnInit(): void {

    this.title.setTitle(
      'JavaBridge Connect | Java Training & Full Stack Courses'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'JavaBridge Connect provides practical Java training, Java Full Stack courses, Spring Boot, Microservices, AWS, Angular and SQL training with real-time IT projects and hands-on learning.'
    });
  }
}

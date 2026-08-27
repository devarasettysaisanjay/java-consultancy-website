import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceDetailsComponent } from './pages/service-details/service-details.component';
import { FeaturesComponent } from './pages/features/features.component';
import { AboutComponent } from './pages/about/about.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { EnrollComponent } from './pages/enroll/enroll.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { BatchesComponent } from './pages/batches/batches.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { InterviewSupportComponent } from './pages/interview-support/interview-support.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ChatagentComponent } from './chatagent/chatagent.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,

    NavbarComponent,

    FooterComponent,

    ServiceCardComponent,

    HomeComponent,

    ServicesComponent,

    ServiceDetailsComponent,

    FeaturesComponent,

    AboutComponent,

     CoursesComponent,
     CourseDetailsComponent,
     EnrollComponent,
     PaymentSuccessComponent,
     BatchesComponent,
     StudentDashboardComponent,
     MyCoursesComponent,
     InterviewSupportComponent,
     LoginComponent,
     RegisterComponent,
     ContactUsComponent,
     ChatagentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

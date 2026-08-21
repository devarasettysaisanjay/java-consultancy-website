import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServiceDetailsComponent } from './pages/service-details/service-details.component';
import { ServicesComponent } from './pages/services/services.component';
import { FeaturesComponent } from './pages/features/features.component';
import { AboutComponent } from './pages/about/about.component';

import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { EnrollComponent } from './pages/enroll/enroll.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactUsComponent } from './contact-us/contact-us.component';


const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

   {
    path: 'contact-us',
    component: ContactUsComponent
  },

{
  path :'create-account',
  component:RegisterComponent
},


   {
    path: 'login',
    component: LoginComponent
  },

 {
  path: 'enroll/:slug',
  component: EnrollComponent
},

  {
    path: 'services/:slug',
    component: ServiceDetailsComponent
  },


  {
  path: 'courses/:slug',
  component: CourseDetailsComponent
},

  {
  path: 'courses',
  component: CoursesComponent
},

  {
    path: 'services',
    component: ServicesComponent
  },

  {
    path: 'features',
    component: FeaturesComponent
  },

  {
    path: 'about',
    component: AboutComponent
  },

 

  {
    path: '**',
    redirectTo: ''
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component } from '@angular/core';
import { SERVICES } from 'src/app/data/services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
 services = SERVICES;
}

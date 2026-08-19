import { Component } from '@angular/core';
import { SERVICES } from 'src/app/data/services';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services = SERVICES;

}

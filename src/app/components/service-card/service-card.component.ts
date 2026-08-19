import { Component, Input } from '@angular/core';
import { Service } from 'src/app/models/service.model';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent {
  @Input() service: Service | undefined;
// @Input() service: Service = {
//     slug: '',
//     name: '',
//     icon: '',
//     description: '',
//     overview: '',
//     contents: []
//   };
}

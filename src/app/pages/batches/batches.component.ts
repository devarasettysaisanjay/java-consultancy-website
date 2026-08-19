import { Component } from '@angular/core';
import { BATCHES } from 'src/app/data/batches';
import { Batch } from 'src/app/models/batch.model';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent {

  batches: Batch[] = BATCHES;
}

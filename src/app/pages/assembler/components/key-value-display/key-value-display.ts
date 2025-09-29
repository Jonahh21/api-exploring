import { Component, input } from '@angular/core';
import { Register } from '../../../../services/assembler.service';

@Component({
  selector: 'app-key-value-display',
  imports: [],
  templateUrl: './key-value-display.html',
  styleUrl: './key-value-display.css'
})
export class KeyValueDisplay {
  keyvaluepairs = input.required<Register[]>()


}

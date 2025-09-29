import { Component, effect, model } from '@angular/core';

@Component({
  selector: 'app-inputbox',
  imports: [],
  templateUrl: './inputbox.html',
  styleUrl: './inputbox.css'
})
export class Inputbox {
  text = model("")

  textChanged(value: string) {
    this.text.set(value)
  }
}

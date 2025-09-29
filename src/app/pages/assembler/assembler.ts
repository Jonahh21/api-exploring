import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommandDisplay } from "./components/command-display/command-display";
import { Inputbox } from "./components/inputbox/inputbox";
import { KeyValueDisplay } from './components/key-value-display/key-value-display';
import { AssemblerService } from '../../services/assembler.service';

@Component({
  selector: 'app-assembler',
  imports: [CommandDisplay, Inputbox, KeyValueDisplay],
  templateUrl: './assembler.html',
})
export class Assembler {
  editorText = signal("")

  asserv = inject(AssemblerService)

  splittedLines = computed(() => {
    let splitted = this.editorText().toUpperCase().split("\n")
    return splitted
  })
}

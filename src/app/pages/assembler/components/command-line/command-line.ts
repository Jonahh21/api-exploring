import { AnimationCallbackEvent, Component, computed, effect, inject, input } from '@angular/core';
import { animate } from 'animejs';
import { AssemblerService } from '../../../../services/assembler.service';

@Component({
  selector: 'app-command-line',
  imports: [],
  templateUrl: './command-line.html',
  styleUrl: './command-line.css'
})
export class CommandLine {
  asserv = inject(AssemblerService)

  line = input.required<string>()
  index = input.required<number>()

  command = computed(() => {
    return this.line().split(" ")[0]
  })

  isValid = computed(() => {
    return this.asserv.checkValidCommand(this.command())
  })

  args = computed(() => {
    const [_, arg0, arg1] = this.line().split(" ")
    return {
      arg0,
      arg1
    }
  })

  commands = effect(() => {
    console.log(this.command(), this.args())
  })
}

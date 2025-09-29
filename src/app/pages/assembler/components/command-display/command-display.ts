import { AnimationCallbackEvent, Component, input, signal } from '@angular/core';
import { animate } from 'animejs';
import { CommandLine } from "../command-line/command-line";

@Component({
  selector: 'app-command-display',
  imports: [CommandLine],
  templateUrl: './command-display.html',
  styleUrl: './command-display.css'
})
export class CommandDisplay {
  lines = input.required<string[]>()

  enteringFn(event: AnimationCallbackEvent) {
    console.log("entered")
    animate(event.target, {
      opacity: {
        from: 0
      },
      y: {
        from: -100
      },
      onComplete: () => {
        event.animationComplete()
      }
    })
  }

  leavingFn(event: AnimationCallbackEvent) {
    console.log("leaving")
    animate(event.target, {
      x: {
        to: '100%'
      },
      opacity: {
        to: 0
      },
      onComplete: () => {
        event.animationComplete()
      }
    })
  }
}

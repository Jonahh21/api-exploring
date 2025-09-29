import { computed, effect, Injectable, signal } from '@angular/core';

export interface Register{
  key: string
  value: number
}

@Injectable({
  providedIn: 'root'
})
export class AssemblerService {

  validCommands = signal<string[]>([
    "MOV",
    "ADD",
    "SUB",
    "MARK",
    "JMP"
  ])

  index = signal(0)
  nextindex = signal(0)

  memory = signal<Record<string, number>>({})
  markindices = signal<Record<string, number>>({})

  registers = computed<Register[]>(() => {
    let keys = Object.keys(this.memory())
    return keys.map((key) => {
      const value = this.memory()[key]
      return {
        key,
        value
      }
    })
  })

  registerMark(key: string, index: number) {
    this.markindices.update((marks) => {
      marks[key] = index
      return marks
    })
  }

  jumpto(mark: string) {
    if(!this.markindices()[mark]) return
    this.nextindex.set(this.markindices()[mark])
  }

  registersChanged = effect(() => {
    console.table(this.registers())
  })

  checkValidCommand(text: string) {
    return this.validCommands().includes(text)
  }

  getRegister(key: string) {
    if(this.memory()[key] == undefined) this.setRegister(key, 0)
    return this.memory()[key]
  }

  setRegister(key: string, value: number){
    this.memory.update((reg) => {
      reg[key] = value
      return reg
    })
  }
}

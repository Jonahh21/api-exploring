import { Component, computed, input } from '@angular/core';
import { Game } from '../../../interfaces/game.interface';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSteam } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-game-cell',
  imports: [CurrencyPipe, FontAwesomeModule],
  templateUrl: './game-cell.html',
})
export class GameCell {

  steamIcon = faSteam

  game = input.required<Game>()

  steamLink = computed(() => {
    if(this.game().steamAppID == null) return ''

    return `https://store.steampowered.com/app/${this.game().steamAppID}`
  })

}

import { Component, computed, inject, signal } from '@angular/core';
import { SearchBar } from "../../common/search-bar/search-bar";
import { rxResource, toObservable } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { GameDealsService } from '../../services/gamedeals.service';
import { Game } from '../../interfaces/game.interface';
import { CurrencyPipe } from '@angular/common';
import { searchWithDebounce } from '../../common/utilities/searchwithdebounce';
import { GameCell } from './game-cell/game-cell';

@Component({
  selector: 'app-gamedeals',
  imports: [SearchBar, GameCell],
  templateUrl: './gamedeals.html',
})
export class GameDeals {

  gdServ = inject(GameDealsService)

  textSearch = signal<string>("")

  games = searchWithDebounce(toObservable(this.textSearch), this.gdServ.searchGames.bind(this.gdServ), 500)

  sortedGames = computed(() => {
    return this.games()?.sort((a, b) => {
      return parseFloat(a.cheapest) - parseFloat(b.cheapest)
    })
    .filter(g => g.steamAppID != null) ?? []
  })
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Game } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GameDealsService {
  
  readonly baseURL = "https://www.cheapshark.com/api/1.0"
  hc = inject(HttpClient)

  searchGames(text: string){
    return this.hc.get<Game[]>(`${this.baseURL}/games`, {
      params: {
        title: text
      }
    })
  }
}

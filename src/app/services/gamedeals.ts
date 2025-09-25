import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, identity, map, of, tap } from 'rxjs';
import { Game } from '../interfaces/game.interface';
import { Store } from '../interfaces/store.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { DealLookup } from '../interfaces/deal-lookup.interface';

@Injectable({
  providedIn: 'root'
})
export class GameDealsService {
  
  readonly baseURL = "https://www.cheapshark.com/api/1.0"

  readonly baseImgURL = "https://www.cheapshark.com"

  getImg(endpoint: string) {
    return this.baseImgURL + endpoint
  }

  hc = inject(HttpClient)

  searchGames(text: string){
    return this.hc.get<Game[]>(`${this.baseURL}/games`, {
      params: {
        title: text
      }
    })
  }

  searchDeal(id: string) {
    return this.hc.get<DealLookup[]>(`${this.baseURL}/deals`, {
      params: {
        steamAppID: id
      }
    }).pipe(
      tap((res) => {
        console.log(res)
      })
    )
  }

  getStoreById(id: string) {
    const call = this.getStores().pipe(
      map((stores) => {
        const store = stores.find((st) => st.storeID == id)

        return store || null
      })
    )

    return call
  }

  getStores(){
    
    if(localStorage.getItem("stores") != null) {
      return of(JSON.parse(localStorage.getItem("stores")!) as Store[])
    } else {
      return this.hc.get<Store[]>(`${this.baseURL}/stores`).pipe(
        map((stores) => {
          stores.map((store) => {
            store.images.banner = this.getImg(store.images.banner)
            store.images.icon = this.getImg(store.images.icon)
            store.images.logo = this.getImg(store.images.logo)

            return store
          })

          return stores
        }),
        tap((stores) => {
          localStorage.setItem("stores", JSON.stringify(stores))
        })
      )
    }
  }
}

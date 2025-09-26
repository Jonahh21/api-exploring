import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, identity, map, of, tap } from 'rxjs';
import { Game } from '../interfaces/game.interface';
import { Store } from '../interfaces/store.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { DealLookup } from '../interfaces/deal-lookup.interface';
import { LocalStorageRepository } from '../common/repositories/localstorage.repo';

@Injectable({
  providedIn: 'root'
})
export class GameDealsService {

  lsrepo = inject(LocalStorageRepository)
  
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
      }),
      tap((res) => {
        this.addToPriceHistory(res)
      }),
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

  // #region IDs Trackeadas

  addToTracked(steamAppID: string) {
    this.lsrepo.trackedGames.update((games) => {
      games ??= []
      games.push(steamAppID)
      return [...new Set(games)]
    })
  }

  removeFromTracked(steamAppID: string) {
    if (!this.isTracked(steamAppID)) return
    this.lsrepo.trackedGames.update((games) => games.filter((val) => val != steamAppID))
    this.lsrepo.priceHistory.update((prices) => prices.filter((val) => val.steamAppID != steamAppID))
  }

  isTracked(steamAppID: string): boolean {
    let tracked = this.lsrepo.trackedGames()?.find((val) => val == steamAppID)
    return tracked != undefined
  }

  // #endregion
  

  // #region Historial de precios

  addToPriceHistory(deals: DealLookup[]) {
    let sorted = deals.sort((a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice))
    if (sorted.length == 0) return
    let cheapest = sorted[0]
    let tracked = this.isTracked(cheapest.steamAppID)
    if (tracked) {


      this.lsrepo.priceHistory.update((prices) => {
        prices.push({
          lowestPrice: parseFloat(cheapest.salePrice),
          steamAppID: cheapest.steamAppID,
          datechecked: new Date(Date.now())
        })

        prices.sort((a, b) => {
          return a.datechecked.valueOf() - b.datechecked.valueOf()
        })

        return prices
      })
    }
  }

  getPriceHistory(steamAppID: string) {
    // filter by steamappID and compress by same day taking the lower

    

    return this.lsrepo.priceHistory().filter((price) => price.steamAppID == steamAppID)
  }

  // #endregion



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

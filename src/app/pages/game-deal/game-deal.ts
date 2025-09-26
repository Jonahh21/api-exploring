import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DealLookup } from '../../interfaces/deal-lookup.interface';
import { delay, forkJoin, interval, map, mergeAll, shareReplay, switchMap, timeout } from 'rxjs';
import { GameDealsService } from '../../services/gamedeals.service';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { faCalendar, faMoneyBill, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSteam } from '@fortawesome/free-brands-svg-icons';
import { ColumnChart } from '../../common/column-chart/column-chart';

@Component({
  selector: 'app-game-deal',
  imports: [DatePipe, CurrencyPipe, FontAwesomeModule, PercentPipe, DecimalPipe, CommonModule, ColumnChart],
  templateUrl: './game-deal.html',
})
export class GameDeal {

  starIcon = faStar
  steamIcon = faSteam
  dateIcon = faCalendar
  moneyIcon = faMoneyBill

  gdServ = inject(GameDealsService)

  route = inject(ActivatedRoute)

  deal = signal<DealLookup[]>([])

  gameInfo = computed(() => {
    if (this.deal().length == 0 || !this.deal()[0]) return null
    const game = this.deal()[0]
    return {
      steamAppID: game.steamAppID,
      metacriticScore: parseFloat(game.metacriticScore) / 100,
      steamRatingCount: game.steamRatingCount,
      steamRatingPercent: parseFloat(game.steamRatingPercent) / 100,
      steamRatingText: game.steamRatingText,
      title: game.title,
      normalPrice: game.normalPrice,
      image: game.thumb,
      releaseDate: game.releaseDate * 1000,
      cheapest: game.salePrice
    }
  })

  toggleTracked() {
    if (this.gdServ.isTracked(this.gameInfo()?.steamAppID ?? "")) {
      this.gdServ.removeFromTracked(this.gameInfo()!.steamAppID)
    } else {
      if (this.gameInfo()) this.gdServ.addToTracked(this.gameInfo()!.steamAppID)
    }
  }

  priceHistory = computed(() => {
    if(this.gameInfo() == null) return []
    return this.gdServ.getPriceHistory(this.gameInfo()?.steamAppID!)
  })

  priceTableData = computed(() => {
    const history = this.priceHistory();
    const title = `Price history of ${this.gameInfo()?.title}`;
    const xaxislabels = history.map(h => new Date(h.datechecked).toLocaleDateString());
    const data = [{
      name: "Price",
      data: history.map(h => h.lowestPrice),
      color: "#FF0000"
    }] as ApexAxisChartSeries;

    return {
      title,
      xaxislabels,
      data
    };
  })

  isTracked = computed<boolean>(() => this.gdServ.isTracked(this.gameInfo()?.steamAppID ?? ""))


  debuggi = effect(() => {
    console.log({tracked: this.isTracked(), salehistory: this.priceHistory()})
  })


  dealInfoChanged = effect((onCleanup) => {
    

    let stores = forkJoin(this.deal()
    .sort((a, b) => {
      return parseFloat(a.salePrice) - parseFloat(b.salePrice)
    })
    .map((d) => {
      return this.gdServ.getStoreById(d.storeID)
    })).pipe(
      shareReplay(1)
    ).subscribe((stores) => {
      if (stores != null){
        this.storeNames.set(stores.map(s => s!.storeName))
      }
    })

    //Update chart data
    onCleanup(() => {
      stores.unsubscribe()
    })
  })

  dealPrices = computed<ApexAxisChartSeries>(() => {
    let saleprices = this.deal().sort((a, b) => {
      return parseFloat(a.salePrice) - parseFloat(b.salePrice)
    }).map(deal => parseFloat(deal.salePrice))

    return [{
      name: "SalePrice",
      data: saleprices,
      color: "#FF0000"
    }] as ApexAxisChartSeries
  })

  storeNames = signal<string[]>([])

  constructor() {
    this.route.params.pipe(
      map((params) => {
        return params['id'] as string
      }),
      switchMap((id) => {
        return this.gdServ.searchDeal(id)
      })
    ).subscribe((gdeal) => {
      console.log("El deal: ", gdeal)
      this.deal.set(gdeal)
    })
  }
}

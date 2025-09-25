import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DealLookup } from '../../interfaces/deal-lookup.interface';
import { delay, forkJoin, map, mergeAll, switchMap, timeout } from 'rxjs';
import { GameDealsService } from '../../services/gamedeals';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { faCalendar, faMoneyBill, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSteam } from '@fortawesome/free-brands-svg-icons';
import { CategoryScale, Chart, ChartConfiguration, ChartItem, ChartOptions, ChartType, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from "chart.js";

@Component({
  selector: 'app-game-deal',
  imports: [DatePipe, CurrencyPipe, FontAwesomeModule, PercentPipe, DecimalPipe, CommonModule],
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

  chart: Chart | null = null

  gameInfo = computed(() => {
    if (this.deal().length == 0) return null
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

  dealInfoChanged = effect(() => {
    let deals = this.deal().sort((a, b) => {
      return parseFloat(a.salePrice) - parseFloat(b.salePrice)
    })

    let stores = forkJoin(this.deal().map((d) => {
      return this.gdServ.getStoreById(d.storeID)
    }))

    stores
    .pipe(
      delay(1000)
    )
    .subscribe((sts) => {

      if(this.chart != null) {
        this.chart.data = {
          labels: sts.map((store) => store?.storeName || ""),
          datasets: [{
            data: deals.map((deal) => parseFloat(deal.salePrice)),
            label: "Sale price",
            borderWidth: 5,
            backgroundColor: "#FF000088"
          },{
            data: deals.map((deal) => parseFloat(deal.savings)),
            label: "Savings",
            borderColor: "#FF000088"
          }]
        }
        this.chart?.update()
      }
      console.log("Chort", this.chart)
    })
  })

  makeChart() {
    const ctx = document.getElementById('ratingchart');
    if (this.chart) {
      this.chart.destroy();
    }
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);
    this.chart = new Chart(ctx as any, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      }
    });
  }

  ngAfterViewInit() {
    this.makeChart()
  }

  constructor() {
    this.route.params.pipe(
      map((params) => {
        return params['id'] as string
      }),
      switchMap((id) => {
        return this.gdServ.searchDeal(id)
      })
    ).subscribe((gdeal) => {
      setTimeout(this.makeChart, 10)
      this.deal.set(gdeal)
    })
  }
}

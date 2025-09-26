import { effect, Injectable, signal, WritableSignal } from "@angular/core";

export interface PriceHistory {
    steamAppID: string
    lowestPrice: number
    datechecked: Date
}

@Injectable({
    providedIn: 'root'
})
export class LocalStorageRepository {

    
    public trackedGames: WritableSignal<string[]> = this.restoreFromLocalStorage('trackedgames')

    public priceHistory: WritableSignal<PriceHistory[]> = this.restoreFromLocalStorage('pricehistory')

    restoreFromLocalStorage<T extends any[]>(key: string): WritableSignal<T> {
        const data = localStorage.getItem(key)
        let parsed: T = data ? JSON.parse(data) : ([] as unknown as T)
        return signal<T>(parsed)
    }

    putInLocalStorage<T>(key: string, value: T) {
        let stringed = JSON.stringify(value)
        localStorage.setItem(key, stringed)
    }

    storageDidChange = effect(() => {
        console.log("PriceHistory changed", this.priceHistory())
        console.log("TrackedGames changed", this.trackedGames())

        this.putInLocalStorage('trackedgames', this.trackedGames())
        this.putInLocalStorage('pricehistory', this.priceHistory())
    })

    // No inicializar en el constructor ni en la declaración
    constructor() {
        console.log(this.trackedGames, this.priceHistory)
    }
}

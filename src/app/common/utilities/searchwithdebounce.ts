import { signal, Signal, WritableSignal } from "@angular/core";
import { debounceTime, distinctUntilChanged, Observable, switchMap } from "rxjs";

export function searchWithDebounce<T, F>(searchingvalue: Observable<T>, searchoperation: (searchvalue: T) => Observable<F>, ms : number = 300): WritableSignal<F | null> {
    const exporting = signal<F | null>(null)

    searchingvalue.pipe(
        debounceTime(ms),
        distinctUntilChanged(),
        switchMap(searchoperation)
    ).subscribe((value) => exporting.set(value))

    return exporting
}
import { Component, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import {faRotateRight} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-search-bar',
  imports: [ FontAwesomeModule ],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  searchText = model.required<string>()

  faRR = faRotateRight
}

import { Component, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
})
export class Navigation {

  name1 = environment.appName1
  name2 = environment.appName2

  links = signal<{
    url: string
    title: string
  }[]>([{
    url: '/gamedeals',
    title: 'Game Deals'
  },{
    url: '/assembler',
    title: 'Assembly Interpreter'
  }])

}

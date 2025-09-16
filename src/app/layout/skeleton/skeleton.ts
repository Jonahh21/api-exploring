import { Component } from '@angular/core';
import { Navigation } from "../navigation/navigation";
import { Footer } from "../footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-skeleton',
  imports: [Navigation, Footer, RouterOutlet],
  templateUrl: './skeleton.html',
})
export class Skeleton {

}

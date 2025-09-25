import { Component } from '@angular/core';
import { Navigation } from "../navigation/navigation";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-skeleton',
  imports: [Navigation, RouterOutlet],
  templateUrl: './skeleton.html',
})
export class Skeleton {

}

import { Component } from '@angular/core';
import { DrawDataService } from '../draw-data.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  constructor(private drawData: DrawDataService) { }

  openCanvas() {
    this.drawData.landingPage = false;
  }

}

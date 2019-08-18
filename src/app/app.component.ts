import { Component } from '@angular/core';
import { DrawDataService } from './draw-data.service';
import {trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DrawDataService],
  animations: [
    trigger('showKeys', [
      state('false', style({
        bottom: '-130%',
      })),
      state('true', style({
        bottom: '0%',
      })),
      transition('true <=> false', [
        animate('500ms ease-out'),
      ]),
    ]),
  ],
})
export class AppComponent {

  constructor(public drawData: DrawDataService) {}
}

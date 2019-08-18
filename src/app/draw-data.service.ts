import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawDataService {

  color = { string: '#000000', value: [0, 0, 0] };
  tool: string  = 'pen';
  size: number = 32;
  maxHeight: number = 0;
  dataFrames: any[] = [];
  imgDatas: Subject<any> = new Subject();
  changeFrame: Subject<any> = new Subject();
  changeSize: Subject<any> = new Subject();
  landingPage: boolean = true;
  keysPage: boolean = false;
  keys = {
    pen: ['P', 'p'],
    line: ['L', 'l'],
    rect: ['R', 'r'],
    circle: ['C', 'c'],
    bucket: ['B', 'b'],
    eraser: ['E', 'e'],
    lighten: ['G', 'g'],
    dithering: ['D', 'd'],
    picker: ['A', 'a'],
    size: ['S', 's'],
  }

  constructor() { }
}

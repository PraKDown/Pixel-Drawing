import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DrawDataService } from '../draw-data.service';
import { FileSaverService } from 'ngx-filesaver';
declare const GIF: any;

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements AfterViewInit {

  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  timerId: any;
  delay: number = 1000;
  height: number = 1000;
  width: number = 1000;

  constructor(
    public drawData: DrawDataService,
    private fileSaverService: FileSaverService,
    private renderer: Renderer2,
    ) { }

  animate(perSec) {
    this.delay = 1000 / perSec;
    try {
      clearInterval(this.timerId);
      let step = 0;
      this.timerId = setInterval(() => {
        step += 1;
        if (step >= this.drawData.dataFrames.length) {
          step = 0;
        }
        this.canvas.nativeElement.getContext('2d').
          putImageData(this.drawData.dataFrames[step], 0, 0);
      },                         this.delay);
    } catch (error) {
      this.animate(perSec);
    }
  }

  fullscreen() {
    this.canvas.nativeElement.requestFullscreen();
  }

  save() {
    const nowData = new Date();
    this.canvas.nativeElement.getContext('2d').
          putImageData(this.drawData.dataFrames[0], 0, 0);
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: this.width,
      height: this.height,
    });
    this.drawData.dataFrames.forEach((elem) => {
      const canvas = this.renderer.createElement('canvas');
      canvas.getContext('2d').putImageData(elem, 0, 0);
      const newCanvas = this.renderer.createElement('canvas');
      newCanvas.height = this.height;
      newCanvas.width = this.width;
      newCanvas.getContext('2d').
        drawImage(canvas, 0, 0, this.drawData.size, this.drawData.size, 0, 0, this.width, this.height);
      gif.addFrame(newCanvas.getContext('2d'), { delay: this.delay, copy: true });
    })

    gif.on('finished', (blob) => {
      this.fileSaverService.save(blob,
                                 `Pixel Drawing(${nowData.getDate()}-${nowData.getMonth() + 1})`);
    });

    gif.render();
  }

  setWidth(event) {
    this.width = event.target.value;
  }

  setHeight(event) {
    this.height = event.target.value;
  }

  ngAfterViewInit() {
    this.animate(1);
  }

}

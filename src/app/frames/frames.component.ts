import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { DrawDataService } from '../draw-data.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-frames',
  templateUrl: './frames.component.html',
  styleUrls: ['./frames.component.scss']
})
export class FramesComponent implements AfterViewInit {

  @ViewChild('frames', { static: false }) frames: ElementRef;

  numberCurrentCanvas: number = 0;

  constructor(public drawData: DrawDataService,
              private renderer: Renderer2) {
  }

  addFrame(data) {
    this.drawData.dataFrames.push(0);
    this.numberCurrentCanvas = this.drawData.dataFrames.length - 1;
    this.drawData.changeFrame.next(data);
  }

  changeFrame(index) {
    this.numberCurrentCanvas = index;
    this.drawData.changeFrame.next(this.drawData.dataFrames[index]);
  }

  deleteFrame(index) {
    this.drawData.dataFrames.splice(index, 1);
    if (this.numberCurrentCanvas > index) {
      this.numberCurrentCanvas -= 1;
    } else if (this.numberCurrentCanvas === index) {
      this.numberCurrentCanvas = this.drawData.dataFrames.length - 1;
      this.drawData.changeFrame.next(this.drawData.dataFrames[this.numberCurrentCanvas]);
    }
    this.changesSomeData();
  }

  copyFrame(index) {
    const newImageData = this.frames.nativeElement
    .children[this.numberCurrentCanvas]
    .children[0].getContext('2d').createImageData(this.drawData.size, this.drawData.size);
    const copyData = new Uint8ClampedArray(this.drawData.dataFrames[index].data);
    newImageData.data.set(copyData);
    this.addFrame(newImageData);
    setTimeout(() => {
      this.frames.nativeElement
          .children[this.numberCurrentCanvas]
          .children[0].getContext('2d').putImageData(newImageData, 0, 0);
    },         0);
  }

  drop(event) {
    moveItemInArray(this.drawData.dataFrames, event.previousIndex, event.currentIndex);
    setTimeout(() => {
      this.drawData.dataFrames.forEach((elem, index) => {
        this.frames.nativeElement
        .children[index]
        .children[0].getContext('2d').putImageData(elem, 0, 0);
      });
    },         0);
    if (this.numberCurrentCanvas === event.previousIndex) {
      this.numberCurrentCanvas = event.currentIndex;
    } else if (this.numberCurrentCanvas === event.currentIndex) {
      if (event.previousIndex < event.currentIndex) {
        this.numberCurrentCanvas -= 1;
      } else if (event.previousIndex > event.currentIndex) {
        this.numberCurrentCanvas += 1;
      }
    }
    this.changesSomeData();
  }

  changesSomeData() {
    setTimeout(() => {
      let data = '';
      this.drawData.dataFrames.forEach((elem, index) => {
        data += elem.data.join(',');
        if (index !== this.drawData.dataFrames.length - 1) {
          data += ';';
        }
      });
      localStorage.setItem('framesData', data);
    },         0);
  }

  ngAfterViewInit() {
    this.drawData.imgDatas.subscribe((data) => {
      this.drawData.dataFrames[this.numberCurrentCanvas] = data;
      setTimeout(() => {
        this.frames.nativeElement
          .children[this.numberCurrentCanvas]
          .children[0].getContext('2d').putImageData(data, 0, 0);
      },         0);
      this.changesSomeData();
    });
    this.drawData.changeSize.subscribe(() => {
      setTimeout(() => {
        this.drawData.dataFrames.forEach((elem, index) => {
          this.frames.nativeElement
            .children[index]
            .children[0].getContext('2d').putImageData(elem, 0, 0);
          const newImageData = this.frames.nativeElement
            .children[index].children[0]
            .getContext('2d').getImageData(0, 0, this.drawData.size, this.drawData.size);
          this.drawData.dataFrames[index] = newImageData;
        });
      },         0);
      setTimeout(() => {
        this.drawData.dataFrames.forEach((elem, index) => {
          this.frames.nativeElement
            .children[index]
            .children[0].getContext('2d').putImageData(elem, 0, 0);
        });
      },         0);
      this.changesSomeData();
    });
    if (localStorage.getItem('framesData')) {
      const data =  localStorage.getItem('framesData').split(';');
      setTimeout(() => {
        if (data[0].length > 131000) {
          this.drawData.size = 128;
        } else if (data[0].length > 32000) {
          this.drawData.size = 64;
        }
        data.forEach((elem, index) => {
          const dataFrame = new Uint8ClampedArray(elem.split(',').map((elem) => +elem));
          const imageData = this.renderer.createElement('canvas').getContext('2d')
            .createImageData(this.drawData.size, this.drawData.size);
          imageData.data.set(dataFrame);
          this.drawData.dataFrames[index] = imageData;
        });
        this.drawData.changeSize.next();
        this.changeFrame(this.drawData.dataFrames.length - 1);
      },         0);
    }
  }
}

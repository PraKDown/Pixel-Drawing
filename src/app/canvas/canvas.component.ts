import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { DrawDataService } from '../draw-data.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const heightHeader = 50;
    const heightFooter = 20;
    this.drawData.maxHeight = event.target.innerHeight - heightHeader - heightFooter;
  }

  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('backgroundCanvas', { static: false }) backgroundCanvas: ElementRef;
  ctx: any;
  imgData: any;
  oldData: any;
  startPosX: number;
  startPosY: number;
  isDraw: Boolean = false;
  isBucket: { currentColor: number[], currentPos: string[] }
  = { currentColor: [], currentPos: [] };
  currentPosition: string = '0;0';

  constructor(public drawData: DrawDataService) {}

  startDraw(event) {
    this.isDraw = true;
    this.startPosX = Math.floor(event.layerX / (event.srcElement.offsetWidth / this.drawData.size));
    this.startPosY = Math.floor(event.layerY / (
      event.srcElement.offsetHeight / this.drawData.size));
    if (this.drawData.tool === 'pen') {
      this.drawPiksel(this.startPosX, this.startPosY);
    } else if (this.drawData.tool === 'line') {
      this.oldData = new Uint8ClampedArray(
        this.ctx.getImageData(0, 0, this.drawData.size, this.drawData.size).data);
    } else if (this.drawData.tool === 'clear') {
      this.clearPiksel(this.startPosX, this.startPosY);
    } else if (this.drawData.tool === 'rect') {
      this.oldData = new Uint8ClampedArray(
        this.ctx.getImageData(0, 0, this.drawData.size, this.drawData.size).data);
    } else if (this.drawData.tool === 'circle') {
      this.oldData = new Uint8ClampedArray(
        this.ctx.getImageData(0, 0, this.drawData.size, this.drawData.size).data);
    } else if (this.drawData.tool === 'bucket') {
      this.isBucket.currentColor = [];
      this.isBucket.currentPos = [];
      this.isBucket.currentColor.push(
        this.imgData.data[(this.startPosY * this.drawData.size + this.startPosX) * 4 + 0],
        this.imgData.data[(this.startPosY * this.drawData.size + this.startPosX) * 4 + 1],
        this.imgData.data[(this.startPosY * this.drawData.size + this.startPosX) * 4 + 2],
        this.imgData.data[(this.startPosY * this.drawData.size + this.startPosX) * 4 + 3]);
      this.bucket(this.startPosX, this.startPosY);
    } else if (this.drawData.tool === 'lighten') {
      this.lighten(this.startPosX, this.startPosY);
    } else if (this.drawData.tool === 'dithering') {
      this.dithering(this.startPosX, this.startPosY);
    } else if (this.drawData.tool === 'picker') {
      this.pickColor(this.startPosX, this.startPosY);
    }
  }

  endDraw() {
    this.isDraw = false;
    this.imgData = this.ctx.getImageData(0, 0, this.drawData.size, this.drawData.size);
    this.drawData.imgDatas.next(this.imgData);
  }

  draw(event) {
    const x = Math.floor(event.layerX / (event.srcElement.offsetWidth / this.drawData.size));
    const y = Math.floor(event.layerY / (event.srcElement.offsetHeight / this.drawData.size));
    this.currentPosition = `${x + 1};${y + 1}`;
    if (!this.isDraw) return;
    if (this.drawData.tool === 'pen') {
      this.drawline(this.startPosX, this.startPosY, x, y);
      this.startPosX = x;
      this.startPosY = y;
    } else if (this.drawData.tool === 'line') {
      this.imgData.data.set(this.oldData);
      this.drawline(this.startPosX, this.startPosY, x, y);
    } else if (this.drawData.tool === 'clear') {
      this.drawline(this.startPosX, this.startPosY, x, y);
      this.startPosX = x;
      this.startPosY = y;
    } else if (this.drawData.tool === 'rect') {
      this.imgData.data.set(this.oldData);
      this.drawline(this.startPosX, this.startPosY, x, this.startPosY);
      this.drawline(this.startPosX, this.startPosY, this.startPosX, y);
      this.drawline(x, this.startPosY, x, y);
      this.drawline(this.startPosX, y, x, y);
    } else if (this.drawData.tool === 'circle') {
      this.imgData.data.set(this.oldData);
      const offsetX = Math.floor((x - this.startPosX) / 2);
      const offsetY = Math.floor((y - this.startPosY) / 2);
      const r = Math.floor(Math.sqrt(
        Math.pow(x - this.startPosX, 2) + Math.pow(y - this.startPosY, 2)) / 2);
      this.drawCircle(this.startPosX + offsetX, this.startPosY + offsetY, r);
    } else if (this.drawData.tool === 'lighten') {
      this.lighten(x, y);
    } else if (this.drawData.tool === 'dithering') {
      this.dithering(x, y);
    }
  }

  drawPiksel(x, y) {
    this.imgData.data[(y * this.drawData.size + x) * 4 + 0] = this.drawData.color.value[0];
    this.imgData.data[(y * this.drawData.size + x) * 4 + 1] = this.drawData.color.value[1];
    this.imgData.data[(y * this.drawData.size + x) * 4 + 2] = this.drawData.color.value[2];
    this.imgData.data[(y * this.drawData.size + x) * 4 + 3] = 255;
    this.ctx.putImageData(this.imgData, 0, 0);
  }

  clearPiksel(x, y) {
    this.ctx.clearRect(x, y, 1, 1);
  }

  drawCircle(x1, y1, r) {
    let x = 0;
    let y = r;
    let delta = 1 - 2 * r;
    let error = 0;
    while (y >= 0) {
      this.drawPiksel(x1 + x, y1 + y);
      this.drawPiksel(x1 + x, y1 - y);
      this.drawPiksel(x1 - x, y1 + y);
      this.drawPiksel(x1 - x, y1 - y);
      error = 2 * (delta + y) - 1;
      if (delta < 0 && error <= 0) {
        x += 1;
        delta += 2 * x  + 1;
        continue;
      }
      error = 2 * (delta - x) - 1;
      if (delta > 0 && error > 0) {
        y -= 1;
        delta += 1 - 2 * y;
        continue;
      }
      x += 1;
      delta += 2 * (x - y);
      y -= 1;
    }
  }

  drawline(x, y, x1, y1) {
    let x0 = x;
    let y0 = y;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    while (true) {
      if (this.drawData.tool === 'clear') {
        this.clearPiksel(x0, y0);
      } else {
        this.drawPiksel(x0, y0);
      }
      if ((x0 === x1) && (y0 === y1)) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0  += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0  += sy;
      }
    }
  }

  bucket(startX, startY) {
    if (this.imgData.data[(startY * this.drawData.size + startX) * 4]
        === this.drawData.color.value[0]
          && this.imgData.data[(startY * this.drawData.size + startX) * 4 + 1]
          === this.drawData.color.value[1]
          && this.imgData.data[(startY * this.drawData.size + startX) * 4 + 2]
          === this.drawData.color.value[2]
          && this.imgData.data[(startY * this.drawData.size + startX) * 4 + 3] === 255) {
      return;
    }

    const startR = this.imgData.data[(startY * this.drawData.size + startX) * 4];
    const startG = this.imgData.data[(startY * this.drawData.size + startX) * 4 + 1];
    const startB = this.imgData.data[(startY * this.drawData.size + startX) * 4 + 2];
    const startA = this.imgData.data[(startY * this.drawData.size + startX) * 4 + 3];
    const pixelStack = [[startX, startY]];

    const matchStartColor = (pixelPos) => {
      return (this.imgData.data[pixelPos] === startR
        && this.imgData.data[pixelPos + 1] === startG
        && this.imgData.data[pixelPos + 2] === startB
        && this.imgData.data[pixelPos + 3] === startA);
    };

    const colorPixel = (pixelPos) => {
      this.imgData.data[pixelPos] = this.drawData.color.value[0];
      this.imgData.data[pixelPos + 1] = this.drawData.color.value[1];
      this.imgData.data[pixelPos + 2] = this.drawData.color.value[2];
      this.imgData.data[pixelPos + 3] = 255;
    };

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];
      let pixelPos = (y * this.drawData.size + x) * 4;
      while (y-- >= 0 && matchStartColor(pixelPos)) {
        pixelPos -= this.drawData.size * 4;
      }
      pixelPos += this.drawData.size * 4;
      y += 1;
      let reachLeft = false;
      let reachRight = false;
      while (y++ < this.drawData.size - 1 && (this.imgData.data[pixelPos] === startR
                                            && this.imgData.data[pixelPos + 1] === startG
                                            && this.imgData.data[pixelPos + 2] === startB
                                            && this.imgData.data[pixelPos + 3] === startA)) {
        colorPixel(pixelPos);
        if (x > 0) {
          if (matchStartColor(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }
        if (x < this.drawData.size - 1) {
          if (matchStartColor(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }
        pixelPos += this.drawData.size * 4;
      }
    }
    this.ctx.putImageData(this.imgData, 0, 0);
  }

  drawBackground() {
    const ctx = this.backgroundCanvas.nativeElement.getContext('2d');
    const imgData = ctx.createImageData(this.drawData.size, this.drawData.size);
    for (let y = 0; y < this.drawData.size; y += 1) {
      for (let x = 0; x < this.drawData.size; x += 1) {
        let r = 59;
        let g = 59;
        let b = 59;
        if (!((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0))) {
          r = 90;
          g = 90;
          b = 90;
        }
        imgData.data[(y * this.drawData.size + x) * 4 + 0] = r;
        imgData.data[(y * this.drawData.size + x) * 4 + 1] = g;
        imgData.data[(y * this.drawData.size + x) * 4 + 2] = b;
        imgData.data[(y * this.drawData.size + x) * 4 + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  lighten(x, y) {
    if (this.imgData.data[(y * this.drawData.size + x) * 4 + 3] !== 0) {
      this.imgData.data[(y * this.drawData.size + x) * 4 + 3] -= 15;
      this.ctx.putImageData(this.imgData, 0, 0);
    }
  }

  dithering(x, y) {
    if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)) {
      this.drawPiksel(x, y);
    } else {
      this.imgData.data[(y * this.drawData.size + x) * 4 + 0] = 0;
      this.imgData.data[(y * this.drawData.size + x) * 4 + 1] = 0;
      this.imgData.data[(y * this.drawData.size + x) * 4 + 2] = 0;
      this.imgData.data[(y * this.drawData.size + x) * 4 + 3] = 0;
      this.ctx.putImageData(this.imgData, 0, 0);
    }
  }

  pickColor(x, y) {
    const r = this.imgData.data[(y * this.drawData.size + x) * 4 + 0];
    const g = this.imgData.data[(y * this.drawData.size + x) * 4 + 1];
    const b = this.imgData.data[(y * this.drawData.size + x) * 4 + 2];
    this.drawData.color.string = `rgb(${r}, ${g}, ${b})`;
    this.drawData.color.value = [r, g, b];
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.imgData = this.ctx.createImageData(this.drawData.size, this.drawData.size);
    this.drawBackground();
    if (!localStorage.getItem('framesData')) {
      this.drawData.imgDatas.next(this.imgData);
    }
    this.drawData.changeFrame.subscribe((data) => {
      if (data === undefined) {
        const newImageData = this.ctx.createImageData(this.drawData.size, this.drawData.size);
        this.imgData = newImageData;
        this.ctx.putImageData(this.imgData, 0, 0);
        this.drawData.imgDatas.next(this.imgData);
      } else {
        this.imgData = data;
        this.ctx.putImageData(this.imgData, 0, 0);
        this.drawData.imgDatas.next(this.imgData);
      }
    });
    this.drawData.changeSize.subscribe((size) => {
      setTimeout(() => {
        this.drawBackground();
        this.ctx.putImageData(this.imgData, 0, 0);
        this.imgData = this.ctx.getImageData(0, 0, this.drawData.size, this.drawData.size);
      },         0);
    });
    setTimeout(() => {
      this.drawData.maxHeight = this.canvas.nativeElement.offsetHeight;
    },         0);
  }
}

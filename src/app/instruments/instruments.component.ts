import { Component, HostListener } from '@angular/core';
import { DrawDataService } from '../draw-data.service';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.scss']
})
export class InstrumentsComponent {

  @HostListener('document:keypress', ['$event'])
  setToolkey(event: KeyboardEvent) {
    if (this.drawData.keys.pen[0] === event.key || this.drawData.keys.pen[1] === event.key) {
      this.drawData.tool = 'pen';
    } else if (this.drawData.keys.line[0] === event.key
        || this.drawData.keys.line[1] === event.key) {
      this.drawData.tool = 'line';
    } else if (this.drawData.keys.rect[0] === event.key
        || this.drawData.keys.rect[1] === event.key) {
      this.drawData.tool = 'rect';
    } else if (this.drawData.keys.circle[0] === event.key
       || this.drawData.keys.circle[1] === event.key) {
      this.drawData.tool = 'circle';
    } else if (this.drawData.keys.bucket[0] === event.key
       || this.drawData.keys.bucket[1] === event.key) {
      this.drawData.tool = 'bucket';
    } else if (this.drawData.keys.eraser[0] === event.key
       || this.drawData.keys.eraser[1] === event.key) {
      this.drawData.tool = 'clear';
    } else if (this.drawData.keys.lighten[0] === event.key
       || this.drawData.keys.lighten[1] === event.key) {
      this.drawData.tool = 'lighten';
    } else if (this.drawData.keys.dithering[0] === event.key
       || this.drawData.keys.dithering[1] === event.key) {
      this.drawData.tool = 'dithering';
    } else if (this.drawData.keys.size[0] === event.key
       || this.drawData.keys.size[1] === event.key) {
      this.showChoose('size');
    } else if (this.drawData.keys.picker[0] === event.key
       || this.drawData.keys.picker[1] === event.key) {
      this.drawData.tool = 'picker';
    }
  }

  choose: string;
  color: string;

  constructor(public drawData: DrawDataService) { }

  currentColor() {
    return this.drawData.color.string;
  }

  showChoose(instr) {
    if (this.choose === instr) {
      this.choose = '';
    } else {
      this.choose = instr;
    }
  }

  setColor(event) {
    this.drawData.color.string = event.hexString;
    this.drawData.color.value = [event.rgb.red, event.rgb.green, event.rgb.blue];
  }

  setTool(tool) {
    this.drawData.tool = tool;
  }

  setSize(size) {
    this.drawData.size = size;
    this.drawData.changeSize.next(size);
    this.choose = '';
  }

  showKeys() {
    this.drawData.keysPage = !this.drawData.keysPage;
  }

}

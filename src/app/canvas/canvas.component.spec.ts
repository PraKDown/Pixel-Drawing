import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponent } from './canvas.component';
import { ElementRef } from '@angular/core';
import { DrawDataService } from '../draw-data.service';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;
  let canvas: HTMLCanvasElement;
  let ctx: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    component.imgData = ctx.createImageData(32, 32);
    component.ctx = ctx;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be draw piksel', () => {
    component.drawPiksel(0, 0);
    expect(component.ctx.getImageData(0, 0, 32, 32)).toEqual(component.imgData);
  });

  it('should be clear piksel', () => {
    component.drawPiksel(0, 0);
    component.clearPiksel(0, 0);
    expect(component.ctx.getImageData(0, 0, 32, 32).data[3]).toBe(0);
  });

  it('should be change state', () => {
    component.isDraw = true;
    component.endDraw();
    expect(component.isDraw).toBe(false);
  });

  it('should be draw circle', () => {
    component.drawCircle(1, 2, 2);
    expect(component.ctx.getImageData(0, 0, 32, 32).data[7]).toBe(255);
  });

  it('should be draw line', () => {
    component.drawline(0, 0, 31, 31);
    const newImageData = component.ctx.getImageData(0, 0, 32, 32).data;
    const sum = newImageData[4095] + newImageData[3];
    expect(sum).toBe(510);
  });

  it('should be bucket', () => {
    component.ctx.putImageData(component.ctx.createImageData(32, 32), 0, 0);
    component.bucket(10, 10);
    const newImageData = component.ctx.getImageData(0, 0, 32, 32).data;
    const sum = newImageData[4095] + newImageData[3];
    expect(sum).toBe(510);
  });

  it('should be draw background', () => {
    component.backgroundCanvas.nativeElement = canvas;
    component.drawBackground();
    const newImageData = component.backgroundCanvas.nativeElement.getContext('2d').getImageData(0, 0, 32, 32).data;
    const sum = newImageData[0] + newImageData[4];
    expect(sum).toBe(59 + 90);
  });

  it('should be lighten', () => {
    component.drawPiksel(0, 0);
    component.lighten(0, 0);
    expect(component.ctx.getImageData(0, 0, 32, 32).data[3]).toBe(240);
  });

  it('should be dithering', () => {
    component.dithering(0, 0);
    component.dithering(1, 0);
    const newImageData = component.ctx.getImageData(0, 0, 32, 32).data;
    const sum = newImageData[3] + newImageData[7];
    expect(sum).toBe(255);
  });

  it('should be pick color', () => {
    component.drawPiksel(0, 0);
    component.pickColor(0, 0);
    const drawData = fixture.debugElement.injector.get(DrawDataService);
    expect(drawData.color.string).toBe('rgb(0, 0, 0)');
  });

  it('should be start draw', () => {
    const event = {
      layerX: 10,
      layerY: 10,
      srcElement: {
        offsetWidth: 32,
        offsetHeight: 32,
      }
    };
    component.startDraw(event);
    expect(component.ctx.getImageData(0, 0, 32, 32).data[1323]).toBe(255);
  });

  it('should be move draw', () => {
    const event = {
      layerX: 10,
      layerY: 10,
      srcElement: {
        offsetWidth: 32,
        offsetHeight: 32,
      }
    };
    component.startPosX = 0;
    component.startPosY = 0;
    component.isDraw = true;
    component.draw(event);
    expect(component.ctx.getImageData(0, 0, 32, 32).data[1323]).toBe(255);
  });

});

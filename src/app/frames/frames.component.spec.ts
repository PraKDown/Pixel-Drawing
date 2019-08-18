import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesComponent } from './frames.component';
import { DrawDataService } from '../draw-data.service';
import { setInterval } from 'timers';

describe('FramesComponent', () => {
  let component: FramesComponent;
  let fixture: ComponentFixture<FramesComponent>;
  let drawData: DrawDataService;
  let canvas: HTMLCanvasElement;
  let ctx: any;

  // beforeEach((done) => {
  //     TestBed.configureTestingModule({
  //       declarations: [FramesComponent],
  //     })
  //     .compileComponents();
  //     fixture = TestBed.createComponent(FramesComponent);
  //     component = fixture.componentInstance;
  //     drawData = fixture.debugElement.injector.get(DrawDataService);
  //     fixture.detectChanges();
  //     canvas = document.createElement('canvas');
  //     canvas.width = 32;
  //     canvas.height = 32;
  //     ctx = canvas.getContext('2d');
  //     setTimeout(() => {
  //       console.log('dfgdfg');
  //       done();
  //     }, 0);
  // });

  // it('should create', (done) => {
  //   expect(component).toBeTruthy();
  //   setTimeout(() => {
  //     console.log('top');
  //     done();
  //   }, 0);
  // });

  // it('should be add new frame', (done) => {
  //   const prevlength = drawData.dataFrames.length;
  //   component.addFrame(undefined);
  //   expect(drawData.dataFrames.length).toBe(prevlength + 1);
  //   setTimeout(() => {
  //     done();
  //   }, 0);
  // });

  // it('should be change frame', (done) => {
  //   component.changeFrame(3);
  //   expect(component.numberCurrentCanvas).toBe(3);
  //   setTimeout(() => {
  //     done();
  //   }, 2000);
  // });

  // it('should be delete frame', (done) => {
  //   drawData.dataFrames[0] = ctx.getImageData(0, 0, 32, 32);
  //   drawData.dataFrames[1] = ctx.createImageData(32, 32);
  //   const length = drawData.dataFrames.length;
  //   component.deleteFrame(1);
  //   const newLength = drawData.dataFrames.length;
  //   expect(length - 1).toBe(newLength);
  //   setTimeout(() => {
  //     done();
  //   }, 2000);
  // });

  // it('should be copy frame', (done) => {
  //   const canvas2 = document.createElement('canvas');
  //   canvas2.width = 32;
  //   canvas2.height = 32;
  //   component.frames.nativeElement = {
  //     children: [
  //       { children: [canvas] },
  //       { children: [canvas2] },
  //     ]
  //   }
  //   drawData.dataFrames[0] = ctx.getImageData(0, 0, 32, 32);
  //   const length = drawData.dataFrames.length;
  //   component.copyFrame(0);
  //   const newLength = drawData.dataFrames.length;
  //   expect(length + 1).toBe(newLength);
  //   setTimeout(() => {
  //     done();
  //   }, 2000);
  // });

  // it('should be save in localStorage', (done) => {
  //   setTimeout(() => {
  //     component.changesSomeData();
  //     expect(localStorage.getItem('framesData') !== null).toBe(true);
  //   }, 0);
  //   setTimeout(() => {
  //     done();
  //   }, 0);
  // });

  // it('should be swap frame', (done) => {
  //   const canvas2 = document.createElement('canvas');
  //   canvas2.width = 32;
  //   canvas2.height = 32;
  //   component.frames.nativeElement = {
  //     children: [
  //       { children: [ canvas, 0 ] },
  //       { children: [ canvas2, 0 ] }
  //     ]
  //   }
  //   const event = {
  //     previousIndex: 1,
  //     currentIndex: 0,
  //   }
  //   drawData.dataFrames[0] = ctx.getImageData(0, 0, 32, 32);
  //   drawData.dataFrames[1] = ctx.createImageData(32, 32);
  //   const elem = drawData.dataFrames[1];
  //   component.drop(event);
  //   const newElem = drawData.dataFrames[0]
  //   expect(elem).toEqual(newElem);
  //   setTimeout(() => {
  //     done();
  //   }, 2000);
  // });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawDataService } from '../draw-data.service';

import { KeysComponent } from './keys.component';

describe('KeysComponent', () => {
  let component: KeysComponent;
  let fixture: ComponentFixture<KeysComponent>;
  let drawData: DrawDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeysComponent);
    component = fixture.componentInstance;
    drawData = fixture.debugElement.injector.get(DrawDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be change key', () => {
    component.lastAction = 'pen';
    component.lastKey = 'P';
    const event = {
      key: 'O',
    }
    component.endChangeKey(event);
    expect(drawData.keys['pen'][0]).toBe('O');
  });


  it('should be change key', () => {
    component.lastAction = 'pen';
    component.lastKey = 'P';
    const event = {
      key: 'O',
    }
    component.endChangeKey(event);
    expect(drawData.keys['pen'][0]).toBe('O');
  });

  it('should be close keys page', () => {
    const event = {
      srcElement: {
        className: '',
      },
    }
    drawData.keysPage = true;
    component.closeKeysPage(event);
    expect(drawData.keysPage).toBe(false);
  });

  it('should be start change key', () => {
    const action = 'pen';
    component.startChangeKey(action);
    expect(component.lastAction + drawData.keys[action][0] + component.lastKey).toBe('pen...P');
  });
});

import { Component, HostListener } from '@angular/core';
import { DrawDataService } from '../draw-data.service';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})

export class KeysComponent {

  constructor(public drawData: DrawDataService) {}

  lastKey: string = '';
  lastAction: string = '';

  @HostListener('document:keypress', ['$event'])
  endChangeKey(event) {
    if (this.lastAction.length !== 0) {
      for (const action in this.drawData.keys) {
        if (this.drawData.keys[action][0] === event.key.toUpperCase()) {
          alert('Please choose another key');
          return;
        }
      }
      this.drawData.keys[this.lastAction][0] = event.key.toUpperCase();
      this.drawData.keys[this.lastAction][1] = event.key.toLowerCase();
      this.lastKey = '';
      this.lastAction = '';
    }
  }

  @HostListener('document:click', ['$event'])
  closeKeysPage(event) {
    const className = event.srcElement.className;
    if (className !== 'key' && className.split(' ')[0] !== 'keys') {
      this.drawData.keysPage = false;
      if (this.lastAction.length !== 0) {
        this.drawData.keys[this.lastAction][0] = this.lastKey;
        this.drawData.keys[this.lastAction][1] = this.lastKey.toLowerCase();
      }
    }
  }

  startChangeKey(action) {
    if (this.lastAction.length !== 0) {
      this.drawData.keys[this.lastAction][0] = this.lastKey;
      this.drawData.keys[this.lastAction][1] = this.lastKey.toLowerCase();
    }
    this.lastKey = this.drawData.keys[action][0];
    this.lastAction = action;
    this.drawData.keys[action][0] = '...';
  }
}

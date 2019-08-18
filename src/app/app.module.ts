import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSliderModule, MatInputModule, MatSnackBarModule,
  MatButtonModule, MatExpansionModule} from '@angular/material';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InstrumentsComponent } from './instruments/instruments.component';
import { CanvasComponent } from './canvas/canvas.component';
import { FramesComponent } from './frames/frames.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReviewComponent } from './review/review.component';
import { FileSaverModule } from 'ngx-filesaver';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { KeysComponent } from './keys/keys.component';
import { NgColorModule } from 'ng-color';

@NgModule({
  declarations: [
    AppComponent,
    InstrumentsComponent,
    CanvasComponent,
    FramesComponent,
    ReviewComponent,
    LandingPageComponent,
    KeysComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    DragDropModule,
    MatSliderModule,
    MatInputModule,
    FileSaverModule,
    MatSnackBarModule,
    MatButtonModule,
    NgColorModule,
    FormsModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [],
})
export class AppModule { }

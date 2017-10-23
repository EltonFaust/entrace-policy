import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewOccurrencePage } from './new-occurrence';

@NgModule({
  declarations: [
    NewOccurrencePage,
  ],
  imports: [
    IonicPageModule.forChild(NewOccurrencePage),
  ],
})
export class NewOccurrencePageModule {}

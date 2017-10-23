import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListOfOccurrencesPage } from './list-of-occurrences';

@NgModule({
    declarations: [
        ListOfOccurrencesPage,
    ],
    imports: [
        IonicPageModule.forChild(ListOfOccurrencesPage),
    ],
})
export class ListOfOccurrencesPageModule {}

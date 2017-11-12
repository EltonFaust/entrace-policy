import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { AppControllerService } from '../../services/app-controller-service';

import { NewOccurrencePage } from '../new-occurrence/new-occurrence';

@Component({
    selector: 'page-list-of-occurrences',
    templateUrl: 'list-of-occurrences.html',
})
export class ListOfOccurrencesPage {

    public constructor(private modalCtrl: ModalController, private appController: AppControllerService) {}

    public get occurrences() {
        return this.appController.getListOfOccurrences();
    }

    public getIdentifierImage(identifier: string): string {
        return this.appController.getImageUrlForIdentifier(identifier);
    }

    public getIdentifierOccurrence(id: number): string {
        return this.appController.getImageUrlForOccurrence(id);
    }

    public viewOccurrence(occurrence): void {
        this.modalCtrl.create(NewOccurrencePage, {occurrence, hasAction: false}, {enableBackdropDismiss: true}).present();
    }
}

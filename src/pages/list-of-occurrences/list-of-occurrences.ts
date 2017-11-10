import { Component } from '@angular/core';

import { AppControllerService } from '../../services/app-controller-service';

@Component({
    selector: 'page-list-of-occurrences',
    templateUrl: 'list-of-occurrences.html',
})
export class ListOfOccurrencesPage {

    public constructor(private appController: AppControllerService) {}

    public get occurences() {
        return this.appController.getListOfOccurrences();
    }

    public getIdentifierImage(identifier: string): string {
        return this.appController.getImageUrlForIdentifier(identifier);
    }

    public getIdentifierOccurrence(id: number): string {
        return this.appController.getImageUrlForOccurrence(id);
    }
}

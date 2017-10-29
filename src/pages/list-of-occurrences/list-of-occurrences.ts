import { Component, OnInit } from '@angular/core';

import { AppControllerService } from '../../services/app-controller-service';

@Component({
    selector: 'page-list-of-occurrences',
    templateUrl: 'list-of-occurrences.html',
})
export class ListOfOccurrencesPage implements OnInit {

    public occurences: Array<any>;

    public constructor(private appController: AppControllerService) {
        this.occurences = new Array<any>();
    }

    ngOnInit() {
        // this.appController.connectToCurrentSocketUrl();
    }
}

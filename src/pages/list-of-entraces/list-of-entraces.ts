import { Component, OnInit } from '@angular/core';

import { AppControllerService } from '../../services/app-controller-service';

@Component({
    selector: 'page-list-of-entraces',
    templateUrl: 'list-of-entraces.html',
})
export class ListOfEntracesPage implements OnInit {
    public constructor(private appController: AppControllerService) {}

    get entracesList(): Array<any> {
        return this.appController.getListOfEntraces();
    }

    get entracesListJoined(): Array<string> {
        return this.appController.getListOfJoinedEntraces();
    };

    public isJoinedEntrace(entraceId: string): boolean {
        return this.entracesListJoined.indexOf(entraceId) != -1;
    }

    public joinEntrace(entraceId: string): void {
        this.appController.requireJoinEntrace(entraceId).then((entraceId: string) => {
            console.log('Joined entrace with id %s', entraceId);
        });
    }

    public leaveEntrace(entraceId: string): void {
        this.appController.requireLeaveEntrace(entraceId).then(() => {
            console.log('Leaved entrace with id %s', entraceId);
        });
    }

    ngOnInit() {

    }
}

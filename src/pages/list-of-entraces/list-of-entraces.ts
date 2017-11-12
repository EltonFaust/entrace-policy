import { Component } from '@angular/core';

import { AlertController } from 'ionic-angular';

import { AppControllerService } from '../../services/app-controller-service';

@Component({
    selector: 'page-list-of-entraces',
    templateUrl: 'list-of-entraces.html',
})
export class ListOfEntracesPage {
    public constructor(private alertCtrl: AlertController, private appController: AppControllerService) {}

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

    public startReceive(entraceId: string): void {
        this.alertCtrl.create({
            title: 'Confirma?',
            message: 'Liberar novos acessos',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                },
                {
                    text: 'Confirmar',
                    handler: () => {
                        this.appController.requireStartReceiveEntrace(entraceId);
                    }
                }
            ]
        }).present();
    }

    public stopReceive(entraceId: string): void {
        this.alertCtrl.create({
            title: 'Confirma?',
            message: 'Bloquear novos acessos',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                },
                {
                    text: 'Confirmar',
                    handler: () => {
                        this.appController.requireStopReceiveEntrace(entraceId);
                    }
                }
            ]
        }).present();
    }
}

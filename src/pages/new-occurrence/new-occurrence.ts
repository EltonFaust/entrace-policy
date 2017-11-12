import { Component, OnInit } from '@angular/core';

import { AlertController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';

import { AppControllerService } from '../../services/app-controller-service';

@Component({
    selector: 'page-new-occurrence',
    templateUrl: 'new-occurrence.html',
})
export class NewOccurrencePage implements OnInit {

    public occurrenceData: any;
    public hasAction: boolean = false;
    public hasProcessed: boolean = false;
    public hasLiberatedReceive: boolean = false;

    public constructor(
        public navCtrl: NavController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private actionSheetCtrl: ActionSheetController,
        private appController: AppControllerService
    ) {}

    get entrace() {
        if (!this.occurrenceData) {
            return null;
        }

        let currentEntrace = null;

        this.appController.getListOfEntraces().every((entrace) => {
            if (entrace.id == this.occurrenceData.entrace_id) {
                currentEntrace = entrace;
                return false;
            }

            return true;
        });

        return currentEntrace;
    }

    get personImage() {
        if (!this.occurrenceData) {
            return null;
        }

        return this.appController.getImageUrlForIdentifier(this.occurrenceData.person_identifier);
    }

    get occurrenceImage() {
        if (!this.occurrenceData) {
            return null;
        }

        return this.appController.getImageUrlForOccurrence(this.occurrenceData.id);
    }

    public releaseOccurrence(): void {
        const handler = (message: string, setStatusMessage: string) => {
            this.alertCtrl.create({
                title: 'Confirma?',
                message: message,
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
                            this.appController.setOccurrenceStatus(this.occurrenceData.id, 1, setStatusMessage);
                            this.navCtrl.pop();
                        }
                    }
                ]
            }).present();
        }

        this.actionSheetCtrl.create({
            title: 'Liberar acesso',
            buttons: [
                {
                    text: 'Falso positivo',
                    role: 'destructive',
                    handler: () => {
                        handler('Identificação não corresponde a pessoa', 'Falso positivo');
                    }
                },
                {
                    text: 'Liberado com aviso',
                    handler: () => {
                        handler('Identificado corretamente, porem foi liberado com um aviso', 'Liberado com aviso');
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        }).present();
    }

    public blockOccurrence(): void {
        this.alertCtrl.create({
            title: 'Confirma?',
            message: 'Identificação correta e impedido de entrar',
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
                        this.appController.setOccurrenceStatus(this.occurrenceData.id, 2, 'Impedido de entrar');
                        this.navCtrl.pop();
                    }
                }
            ]
        }).present();
    }

    public openEntrace(): void {
        this.appController.requireOpenEntrace(this.entrace.id);
    }

    public closeEntrace(): void {
        this.hasProcessed = true
        this.appController.requireCloseEntrace(this.entrace.id);
    }

    public releaseReceive(): void {
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
                        this.hasLiberatedReceive = true;
                        this.appController.requireStartReceiveEntrace(this.entrace.id);
                    }
                }
            ]
        }).present();
    }

    ngOnInit() {
        this.occurrenceData = this.navParams.get('occurrence');
        this.hasAction = !!this.navParams.get('hasAction');

        console.log(this.occurrenceData);
    }
}

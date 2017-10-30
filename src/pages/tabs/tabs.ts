import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { AppControllerService } from '../../services/app-controller-service';

import { ListOfEntracesPage } from '../list-of-entraces/list-of-entraces';
import { ListOfOccurrencesPage } from '../list-of-occurrences/list-of-occurrences';
import { NewOccurrencePage } from '../new-occurrence/new-occurrence';
import { SettingsPage } from '../settings/settings';

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit {
    public tabs: Array<any>;

    public constructor(private modalCtrl: ModalController, private appController: AppControllerService) {
        this.tabs = [
            {icon: 'exit', title: 'Entradas', component: ListOfEntracesPage},
            {icon: 'finger-print', title: 'Ocorrências', component: ListOfOccurrencesPage},
        ];
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TabsPage');
    }

    ngOnInit() {
        let settingsModal = this.modalCtrl.create(SettingsPage, {}, {enableBackdropDismiss: false});

        settingsModal.onDidDismiss(() => {
            this.appController.watchForNewOccurrences().subscribe((occurrence: any) => {
                console.log('new occurrence', occurrence);

                if (this.appController.isJoinedEntrace(occurrence.entrace_id)) {
                    // treta foi na entrada que o usuario da vinculado
                    let occurrenceModal = this.modalCtrl.create(NewOccurrencePage, {occurrence: occurrence, hasAction: true}, {enableBackdropDismiss: false});
                    occurrenceModal.present();
                }
            });
        });

        settingsModal.present();
    }
}

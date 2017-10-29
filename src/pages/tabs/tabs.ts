import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ListOfEntracesPage } from '../list-of-entraces/list-of-entraces';
import { ListOfOccurrencesPage } from '../list-of-occurrences/list-of-occurrences';
import { SettingsPage } from '../settings/settings';

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit {
    public tabs: Array<any>;

    public constructor(private modalCtrl: ModalController) {
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
        settingsModal.present();
    }
}

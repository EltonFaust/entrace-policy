import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-new-occurrence',
    templateUrl: 'new-occurrence.html',
})
export class NewOccurrencePage {

    public constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewOccurrencePage');
    }
}

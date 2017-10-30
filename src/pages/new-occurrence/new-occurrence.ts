import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-new-occurrence',
    templateUrl: 'new-occurrence.html',
})
export class NewOccurrencePage implements OnInit {

    public occurrenceData: any;
    public hasAction: boolean = false;

    public constructor(public navCtrl: NavController, private navParams: NavParams) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewOccurrencePage');
    }

    ngOnInit() {
        this.occurrenceData = this.navParams.get('occurrence');
        this.hasAction = !!this.navParams.get('hasAction');
    }
}

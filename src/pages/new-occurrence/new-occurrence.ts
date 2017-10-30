import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-new-occurrence',
    templateUrl: 'new-occurrence.html',
})
export class NewOccurrencePage implements OnInit {

    public occurrenceData: any;
    public hasAction: boolean = false;

    public constructor(private navCtrl: NavController, private navParams: NavParams) {}

    public releaseOccurrence(id: number): void {
        this.navCtrl.pop();
    }

    public blockOccurrence(id: number): void {
        this.navCtrl.pop();
    }

    ngOnInit() {
        this.occurrenceData = this.navParams.get('occurrence');
        this.hasAction = !!this.navParams.get('hasAction');
    }
}

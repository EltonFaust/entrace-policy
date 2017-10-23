import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AppControllerService } from '../../services/app-controller-service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public initialForm: FormGroup;

    public constructor(
        private appController: AppControllerService,
        private formBuilder: FormBuilder,
        private nav: NavController
    ) {
        this.appController.getStored('service_url', (service_url: any) => {
            this.initialForm = this.formBuilder.group({
                service_url: [
                    service_url,
                    [
                        Validators.required
                    ]
                ],
            });
        }, 'ws://192.168.1.2:3000');
    }

    public submitForm(): void {
        this.appController.setSocketUrl(this.initialForm.value.service_url);
        this.nav.setRoot('ListOfOccurrencesPage');
    }
}

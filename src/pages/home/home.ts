import { Component } from '@angular/core';
// import { NavController } from 'ionic-angular';

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
        private formBuilder: FormBuilder
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
        }, '');
    }

    public submitForm(): void {
        this.appController.setStored('service_url', this.initialForm.value.service_url, false, () => {
            console.log(this.initialForm.value.service_url)
        });
    }
}

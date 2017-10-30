import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AppControllerService } from '../../services/app-controller-service';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {
    public initialForm: FormGroup;
    public socketError: string;
    public isSendingForm: boolean;

    public constructor(
        private appController: AppControllerService,
        private formBuilder: FormBuilder,
        private viewCtrl: ViewController
    ) {
        this.isSendingForm = false;
    }

    public submitForm(): void {
        let values = this.initialForm.value;
        this.isSendingForm = true;

        this.appController.setServiceUrl(values.service_url);
        this.appController.setCurrentUser({id: values.user_id, name: values.user_name});
        this.appController.setStored('saved_config', {service_url: values.service_url, user_id: values.user_id, user_name: values.user_name});

        this.appController.checkSocketConnection().then(() => {
            this.viewCtrl.dismiss();
            this.appController.requireListOfEntraces();
        }).catch((reason: string) => {
            console.log(reason);
            this.socketError = reason;
            this.isSendingForm = false;
        });
    }

    ngOnInit() {
        this.appController.getStored('saved_config', (saved_config: any) => {
            this.initialForm = this.formBuilder.group({
                service_url: [
                    saved_config.service_url,
                    [Validators.required],
                ],
                user_id: [
                    saved_config.user_id,
                    [Validators.required, Validators.minLength(32), Validators.maxLength(32)],
                ],
                user_name: [
                    saved_config.user_name,
                    [Validators.required, Validators.minLength(5), Validators.maxLength(30)],
                ],
            });
        }, {service_url: '192.168.1.103:3000', user_id: '2815e56a615b7d4c919a53ec3ea066ce', user_name: 'Elton Faust'});
    }
}

import { Injectable /*, NgZone*/ } from '@angular/core';
import { Platform } from 'ionic-angular';

import { NativeStorage } from '@ionic-native/native-storage';

import * as WS from 'ws';

@Injectable()
export class AppControllerService {
    private isDevicePlatform: boolean;
    private bindStoreChange: {[bindKey: string]: (data) => any};

    private socketUrl: string;
    private socketHandle: WS;

    public constructor(
        // private ngZone: NgZone,
        private platform: Platform,
        private nativeStorage: NativeStorage,
    ) {
        this.isDevicePlatform = !this.platform.is('core');
        this.bindStoreChange = {};
    }

    public setSocketUrl(url: string): void {
        this.socketUrl = url;
        this.setStored('service_url', url, false);
    }

    public connectToCurrentSocketUrl(): void {
        if (!this.socketUrl) {
            return;
        }

        this.disconnectSocket();

        this.socketHandle = new WS(this.socketUrl);

        this.socketHandle.on('open', () => {
            console.log('socket open')
        });

        this.socketHandle.on('message', (message: string) => {
            let data = JSON.parse(message);
            console.log(data);
        });
    }

    public disconnectSocket(): void {
        if (this.socketHandle) {
            this.socketHandle.terminate();
            this.socketHandle = null;
        }
    }

    public setStored(key: string, value: any, triggerChange: boolean = true, then?: (success: boolean) => any): void {
        let doOnStore = (success: boolean) => {
            if (then) {
                then(success);
            }

            if (triggerChange && success && this.bindStoreChange[key]) {
                this.bindStoreChange[key](value);
            }
        };

        if (this.isDevicePlatform) {
            this.nativeStorage.setItem(key, value).then(
                () => doOnStore(true),
                () => doOnStore(false)
            );
        } else {
            doOnStore(true);
        }
    }

    public getStored(key: string, then: (data) => any, defaultValue: any = null): void {
        if (this.isDevicePlatform) {
            this.nativeStorage.getItem(key).then(
                (data: any) => then(data),
                () => then(defaultValue)
            );
        } else {
            then(defaultValue);
        }
    }

    public removeStored(key: string, then?: (success: boolean) => any): void {
        if (!then) {
            then = (success: boolean) => { }
        }

        if (this.isDevicePlatform) {
            this.nativeStorage.remove(key).then(
                () => then(true),
                () => then(false)
            );
        } else {
            then(true);
        }
    }

    public addBindStoreChange(key: string, onChange: (data: any) => any): void {
        this.bindStoreChange[key] = onChange;
    }

    public removeBindStoreChange(key: string): void {
        delete this.bindStoreChange[key];
    }

}

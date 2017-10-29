import { Injectable /*, NgZone*/ } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as WS from 'ws';

import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class AppControllerService {
    private isDevicePlatform: boolean;
    private bindStoreChange: {[bindKey: string]: (data) => any};

    private socketUrl: string;
    private socketHandle: WS;

    private user: {id: string, name: string};
    private entraces: Array<any>;
    private watchingEntraces: Array<any>;

    private requestPromises: {[id: string]: Promise<any>};
    private requestObservers: {[id: string]: Observable<any>};

    public constructor(
        // private ngZone: NgZone,
        private platform: Platform,
        private nativeStorage: NativeStorage,
        private events: Events
    ) {
        this.isDevicePlatform = !this.platform.is('core');
        this.bindStoreChange = {};

        this.user = {id: '#unknown#', name: 'Unknown'};
        this.entraces = new Array<any>();
        this.watchingEntraces = new Array<string>();
        this.requestPromises = {};
        this.requestObservers = {};
    }

    public isDefinedSocketUrl(): boolean {
        return !!this.socketUrl;
    }

    public setSocketUrl(url: string): void {
        this.socketUrl = url;
        this.setStored('service_url', url, false);
    }

    public setCurrentUser(user: any): void {
        this.user = user;
    }

    public checkSocketConnection(): Promise<any> {
        return new Promise<any>((resolve: () => any, reject: (reason: string) => any) => {
            if (!this.socketUrl) {
                reject('Socket url not defined');
                return;
            }

            if (!!this.socketHandle) {
                resolve();
                return;
            }

            this.socketHandle = new WS(this.socketUrl);

            this.socketHandle.on('error', (e: Error) => {
                reject('Error "' + e.message + '" occoured while trying to connect to connect to "' + this.socketUrl + '"');
                // this.socketHandle.terminate();
                this.socketHandle = null;
            });

            this.socketHandle.on('open', () => {
                this.sendMessageToSocket('identify_as', {name: this.user.name});
                resolve();
            });

            this.socketHandle.on('message', (message: string) => {
                let data = JSON.parse(message);

                console.log(data);
                this.events.publish('socket-message:' + data.type, data);
            });

        });
    }

    public disconnectSocket(): void {
        if (this.socketHandle) {
            this.socketHandle.terminate();
            this.socketHandle = null;
        }
    }

    private sendMessageToSocket(type: string, data?: any): void {
        try {
            data = data || {};
            data.type = type;
            data = JSON.stringify(data);

            this.socketHandle.send(data);
        } catch(e) {
            console.log('Error "%s" occoured while trying to send data "%s"', e.message, data);
        }
    }

    /*--------------------------------- Actions ---------------------------------*/
    public getListOfEntraces(): Array<any> {
        return this.entraces;
    }

    public getListOfJoinedEntraces(): Array<string> {
        return this.watchingEntraces;
    }

    public isJoinedEntrace(entraceId: string): boolean {
        return this.watchingEntraces.indexOf(entraceId) != -1;
    }

    public requireListOfEntraces(): Promise<Array<any>> {
        if (!!this.requestPromises['list_entraces']) {
            return this.requestPromises['list_entraces'];
        }

        return this.requestPromises['list_entraces'] = new Promise<Array<any>>((resolve: (data: Array<any>) => any) => {
            this.events.subscribe('socket-message:list_of_entraces', (data: any) => {
                resolve(data.list);
                this.events.unsubscribe('socket-message:list_of_entraces');
            });

            this.sendMessageToSocket('list_entraces');
        });
    }

    public requireJoinEntrace(entraceId: string): Promise<any> {
        return new Promise<any>((resolve: (joinedEntraceId: string) => any) => {
            if (this.isJoinedEntrace(entraceId)) {
                resolve(entraceId);
                return;
            }

            this.events.subscribe('socket-message:joined_entrace', (data: any) => {
                resolve(data.id);
                this.events.unsubscribe('socket-message:joined_entrace');
            });

            this.sendMessageToSocket('join_entrace', {entrace_id: entraceId});
        });
    }

    public requireLeaveEntrace(entraceId: string): Promise<any> {
        return new Promise<any>((resolve: () => any) => {
            if (!this.isJoinedEntrace(entraceId)) {
                resolve();
                return;
            }

            this.events.subscribe('socket-message:leaved_entrace', () => {
                resolve();
                this.events.unsubscribe('socket-message:leaved_entrace');
            });

            this.sendMessageToSocket('leave_entrace', {entrace_id: entraceId});
        });
    }

    /*--------------------------------- Storage ---------------------------------*/
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

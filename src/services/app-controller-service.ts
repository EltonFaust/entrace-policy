import { Injectable , NgZone } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
// import * as WS from 'ws';

import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class AppControllerService {
    private isDevicePlatform: boolean;
    private bindStoreChange: {[bindKey: string]: (data) => any};

    private serviceUrl: string;
    // private socketHandle: WS;
    private socketHandle: WebSocket;

    private user: any;
    private entraces: Array<any>;
    private occurrences: Array<any>;
    private watchingEntraces: Array<any>;

    private requestPromises: {[id: string]: Promise<any>};
    private requestObservers: {[id: string]: Observable<any>};

    public constructor(
        private ngZone: NgZone,
        private platform: Platform,
        private nativeStorage: NativeStorage,
        private events: Events
    ) {
        this.isDevicePlatform = !this.platform.is('core');
        this.bindStoreChange = {};

        this.user = {id: null, name: 'Unknown'};
        this.entraces = new Array<any>();
        this.occurrences = new Array<any>();
        this.watchingEntraces = new Array<string>();

        this.requestPromises = {};
        this.requestObservers = {};
    }

    public isDefinedServiceUrl(): boolean {
        return !!this.serviceUrl;
    }

    public setServiceUrl(url: string): void {
        this.serviceUrl = url;
    }

    public setCurrentUser(user: any): void {
        this.user = user;
    }

    public checkSocketConnection(): Promise<any> {
        return new Promise<any>((resolve: () => any, reject: (reason: string) => any) => {
            if (!this.serviceUrl) {
                reject('Socket url not defined');
                return;
            }

            if (!!this.socketHandle) {
                resolve();
                return;
            }

            this.socketHandle = new WebSocket('ws://' + this.serviceUrl);

            this.socketHandle.onerror = (e) => {
                reject('Error "' + e + '" occoured while trying to connect to connect to "' + this.serviceUrl + '"');
                // this.socketHandle.terminate();
                this.socketHandle = null;
            }

            this.socketHandle.onopen = () => {
                new Promise<Array<any>>((resolve: (data: any) => any) => {
                    this.events.subscribe('socket-message:login_response', (data: any) => {
                        resolve(data);
                        this.events.unsubscribe('socket-message:login_response');
                    });

                    this.sendMessageToSocket('try_login');
                }).then((data: any) => {
                    if (data.success) {
                        this.user = data.userData;

                        resolve();
                    } else {
                        this.disconnectSocket();
                        reject('Invalid login');
                    }
                });
            };

            this.socketHandle.onmessage = (message) => {
                let data = JSON.parse(message.data);

                console.log(message);
                this.events.publish('socket-message:' + data.type, data);
            }
        });
    }

    public disconnectSocket(): void {
        if (this.socketHandle) {
            this.socketHandle.close();
            this.socketHandle = null;
        }
    }

    private sendMessageToSocket(type: string, data?: any): void {
        try {
            data = data || {};
            data.type = type;
            data.user_id = this.user.id;
            data = JSON.stringify(data);

            console.log('Sending data: %s', data);

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
                this.ngZone.run(() => {
                    this.entraces = data.list;
                });

                resolve(data.list);
                this.events.unsubscribe('socket-message:list_of_entraces');
            });

            this.sendMessageToSocket('list_entraces');
        });
    }

    public watchForEntraceUpdate(): Observable<any> {
        if (!!this.requestObservers['entrace_update']) {
            return this.requestObservers['entrace_update'];
        }

        return this.requestObservers['entrace_update'] = Observable.create((observer: Observer<any>) => {
            this.events.subscribe('socket-message:entrace_update', (data: any) => {
                this.entraces.every((entrace: any, idx: number) => {
                    if (entrace.id == data.entrace.id) {
                        this.ngZone.run(() => {
                            this.entraces[idx] = data.entrace;
                        });

                        observer.next(data.entrace);
                        return false;
                    }

                    return true;
                });
            });
        });
    }

    public getListOfOccurrences(): Array<any> {
        return this.occurrences;
    }

    public requireListOfOccurrences(): Promise<Array<any>> {
        if (!!this.requestPromises['list_occurrences']) {
            return this.requestPromises['list_occurrences'];
        }

        return this.requestPromises['list_occurrences'] = new Promise<Array<any>>((resolve: (data: Array<any>) => any) => {
            this.events.subscribe('socket-message:list_of_occurrences', (data: any) => {
                this.ngZone.run(() => {
                    this.occurrences = data.list;
                });

                resolve(data.list);
                this.events.unsubscribe('socket-message:list_of_occurrences');
            });

            this.sendMessageToSocket('list_occurrences');
        });
    }

    public watchForNewOccurrences(): Observable<any> {
        if (!!this.requestObservers['new_occurrence']) {
            return this.requestObservers['new_occurrence'];
        }

        return this.requestObservers['new_occurrence'] = Observable.create((observer: Observer<any>) => {
            this.events.subscribe('socket-message:new_occurrence', (data: any) => {
                this.ngZone.run(() => {
                    this.occurrences.unshift(data.occurrence);
                });

                observer.next(data.occurrence);
            });
        });
    }

    public watchForOccurrenceUpdate(): Observable<any> {
        if (!!this.requestObservers['occurrence_update']) {
            return this.requestObservers['occurrence_update'];
        }

        return this.requestObservers['occurrence_update'] = Observable.create((observer: Observer<any>) => {
            this.events.subscribe('socket-message:occurrence_update', (data: any) => {
                this.occurrences.every((occurrence: any, idx: number) => {
                    if (occurrence.id == data.occurrence.id) {
                        this.ngZone.run(() => {
                            this.occurrences[idx] = data.occurrence;
                        });

                        observer.next(data.occurrence);
                        return false;
                    }

                    return true;
                });
            });
        });
    }

    public setOccurrenceStatus(occurenceId, status: number, statusMessage): void {
        this.sendMessageToSocket('set_occurence_status', {occurrence_id: occurenceId, status, status_message: statusMessage});
    }

    public requireJoinEntrace(entraceId: string): Promise<any> {
        return new Promise<any>((resolve: (joinedEntraceId: string) => any) => {
            if (this.isJoinedEntrace(entraceId)) {
                resolve(entraceId);
                return;
            }

            this.events.subscribe('socket-message:joined_entrace', (data: any) => {
                this.ngZone.run(() => {
                    this.watchingEntraces.push(entraceId);
                });

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
                this.ngZone.run(() => {
                    this.watchingEntraces.splice(this.watchingEntraces.indexOf(entraceId), 1);
                });

                resolve();
                this.events.unsubscribe('socket-message:leaved_entrace');
            });

            this.sendMessageToSocket('leave_entrace', {entrace_id: entraceId});
        });
    }

    public requireOpenEntrace(entraceId: string): void {
        this.sendMessageToSocket('open_entrace', {entrace_id: entraceId});
    }

    public requireCloseEntrace(entraceId: string): void {
        this.sendMessageToSocket('close_entrace', {entrace_id: entraceId});
    }

    public requireStartReceiveEntrace(entraceId: string): void {
        this.sendMessageToSocket('start_receive', {entrace_id: entraceId});
    }

    public requireStopReceiveEntrace(entraceId: string): void {
        this.sendMessageToSocket('stop_receive', {entrace_id: entraceId});
    }

    /*---------------------------------  UTILS  ---------------------------------*/
    public getImageUrlForIdentifier(identifier: string): string {
        return 'http://' + this.serviceUrl + '/person/' + identifier + '.jpg';
    }

    public getImageUrlForOccurrence(id: number): string {
        return 'http://' + this.serviceUrl + '/occurrences/' + id + '.jpg';
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

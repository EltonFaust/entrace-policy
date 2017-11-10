import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BackgroundMode } from '@ionic-native/background-mode';
import { NativeStorage } from '@ionic-native/native-storage';

import { AppControllerService } from '../services/app-controller-service';

import { MyApp } from './app.component';
import { ListOfEntracesPage } from '../pages/list-of-entraces/list-of-entraces';
import { ListOfOccurrencesPage } from '../pages/list-of-occurrences/list-of-occurrences';
import { NewOccurrencePage } from '../pages/new-occurrence/new-occurrence';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';

@NgModule({
    declarations: [
        MyApp,
        SettingsPage,
        TabsPage,
        ListOfEntracesPage,
        ListOfOccurrencesPage,
        NewOccurrencePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        SettingsPage,
        TabsPage,
        ListOfEntracesPage,
        ListOfOccurrencesPage,
        NewOccurrencePage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},

        StatusBar,
        SplashScreen,
        BackgroundMode,
        NativeStorage,

        AppControllerService
    ]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BackgroundMode } from '@ionic-native/background-mode';
import { NativeStorage } from '@ionic-native/native-storage';

import { AppControllerService } from '../services/app-controller-service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
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

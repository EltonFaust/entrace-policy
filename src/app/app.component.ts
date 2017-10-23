import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode';

// import { AppControllerService } from '../services/app-controller-service';

import { HomePage } from '../pages/home/home';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    public rootPage:any = HomePage;

    private isBackActivated = false;

    public constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private bgMode: BackgroundMode
    ) {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.bgMode.enable();

            this.platform.registerBackButtonAction(() => {
                if (this.isBackActivated) {
                    this.bgMode.moveToBackground();
                } else {
                    this.isBackActivated = true;

                    setTimeout(() => {
                        this.isBackActivated = false;
                    }, 1000);
                }
            }, 100);
        });
    }
}


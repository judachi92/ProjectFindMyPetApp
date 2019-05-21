import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {HTTP} from '@ionic-native/http';
import {Geolocation} from '@ionic-native/geolocation';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {IndexPage} from "../pages/index";
import {MapaPage} from "../pages/mapa/mapa";
import {ScanQRPage} from "../pages/scanQR/scanQR";
import {UserVacantesPage} from "../pages/userVacantes/userVacantes";
import {PublicacionesPage} from "../pages/publicaciones/publicaciones";
import {RegisterPage} from "../pages/register/register";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        IndexPage, MapaPage, ScanQRPage, UserVacantesPage, PublicacionesPage, RegisterPage,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage, IndexPage, MapaPage, ScanQRPage, UserVacantesPage, PublicacionesPage, RegisterPage,
    ],
    providers: [
        BarcodeScanner,
        StatusBar,
        SplashScreen, HTTP, Geolocation,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}

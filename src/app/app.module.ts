import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {HTTP} from '@ionic-native/http';
import {Geolocation} from '@ionic-native/geolocation';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {IndexPage} from "../pages/index";
import {PerfilUsuarioPage} from "../pages/perfilUsuario/perfilUsuario";
import {PublicacionesPage} from "../pages/publicaciones/publicaciones";
import {RegisterPage} from "../pages/register/register";
import {DetallePublicacionPage} from "../pages/detallePublicacion/detallePublicacion";
import {CrearPublicacionPage} from "../pages/crearPublicacion/crearPublicacion";
import { MascotasPage } from '../pages/mascotas/mascotas';


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        IndexPage, PerfilUsuarioPage, MascotasPage,
        PublicacionesPage, RegisterPage, DetallePublicacionPage,
        CrearPublicacionPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage, IndexPage, PerfilUsuarioPage, MascotasPage,
        PublicacionesPage, RegisterPage, DetallePublicacionPage,
        CrearPublicacionPage
    ],
    providers: [
        BarcodeScanner,
        StatusBar,
        SplashScreen, HTTP, Geolocation, Camera,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}

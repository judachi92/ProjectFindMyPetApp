import { Component } from '@angular/core';
import {PublicacionesPage} from "../publicaciones/publicaciones";
import {ScanQRPage} from "../scanQR/scanQR";
import {MapaPage} from "../mapa/mapa";
import {UserVacantesPage} from "../userVacantes/userVacantes";
import {NavController, NavParams} from "ionic-angular";
import {Usuario} from "../../models/usuario";


@Component({
    templateUrl: 'index.html'
})
export class IndexPage {

    tab1Root = PublicacionesPage;
    tab2Root = MapaPage;
    tab3Root = ScanQRPage;
    tab4Root =  UserVacantesPage;

    user: Usuario;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.user = navParams.get("user");
    }
}

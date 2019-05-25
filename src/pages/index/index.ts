import { Component } from '@angular/core';
import {PublicacionesPage} from "../publicaciones/publicaciones";
import {PerfilUsuarioPage} from "../perfilUsuario/perfilUsuario";
import {NavController, NavParams} from "ionic-angular";
import {Usuario} from "../../models/usuario";
import { MascotasPage } from '../mascotas/mascotas';


@Component({
    templateUrl: 'index.html'
})
export class IndexPage {

    tab1Root = PublicacionesPage;
    tab2Root = PerfilUsuarioPage;
    tab4Root =  MascotasPage;

    user: Usuario;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.user = navParams.get("user");
    }
}

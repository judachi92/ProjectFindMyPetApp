import {Component, NgZone} from '@angular/core';
import {NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from '@ionic-native/http';
import {IndexPage} from "../index/index";
import { Mascota } from '../../models/mascota';

@Component({
  selector: 'page-crearMascotas',
  templateUrl: 'crearMascotas.html'
})

export class CrearMascotasPage {


    userSession: Usuario;
    mascotaModel: Mascota;

    header: any = {};
    data: any = {};

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,
        public zone: NgZone,) {

            this.userSession = navParams.data.user;
            this.mascotaModel = new Mascota();
    }

   
    alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    registrarMascota(){
        
    }

}

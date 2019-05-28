import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HTTP} from "@ionic-native/http";
import {Usuario} from "../../models/usuario";

@Component({
  selector: 'page-perfilUsuario',
  templateUrl: 'perfilUsuario.html'
})
export class PerfilUsuarioPage implements OnInit{

    dataurl: any = [];
    data: any = [];
    header: any = {};

    userSession: Usuario;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public http: HTTP,
                public zone: NgZone,
                public loadingCtr:LoadingController )
    {
        this.userSession = navParams.data;
    }

    ngOnInit(): void {
    }

    
    alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}

import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from "@ionic-native/http";
import { DetallePublicacionPage } from '../detallePublicacion/detallePublicacion';
import { CrearPublicacionPage } from '../crearPublicacion/crearPublicacion';

@Component({
  selector: 'page-publicaciones',
  templateUrl: 'publicaciones.html'
})
export class PublicacionesPage{

    dataurl: any = [];
    data: any = [];
    header: any = {};

    userSession: Usuario;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public http: HTTP,
                public zone: NgZone,
                public loadingCtr:LoadingController)
    {
        this.userSession = navParams.data;
        this.listarPublicaciones();
    }

    listarPublicaciones(){
        let loading = this.loadingCtr.create({
            content: 'Consultando las Publicaciones...'
        });
        loading.present();
        this.header['Accept'] = 'application/json';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        this.http.clearCookies();
        this.http.get('http://190.85.111.58:1088/FMpet/public/api/core/publicaciones?limit=15',
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.dataurl=JSON.parse(res.data);
                    
                    this.data = this.dataurl.data;
                    
                    loading.dismiss();
                });
            }).catch(e =>{
                this.alert('error',''+e);
                loading.dismiss();
            });
    }


    getItems(ev) {
        this.data = this.dataurl.data;
        var val = ev.target.value;
        if (val && val.trim() != '') {
            this.data = this.data.filter(item =>  {
                return (item.PERS_NOMBREAPELLIDO.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.PUBL_DESCRIPCION.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    ((''+item.PUBL_FECHACREADO).toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }

    openWiew(objData){
        let alert = this.alertCtrl.create({
            title: 'Publicacion',
            message: 'Ver mas Informacion de la Publicacion',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.goDetallePublicacion(objData);
                    }
                }
            ]
        });
        alert.present();
    }

    goCrearPublicacion(){
        this.navCtrl.push(CrearPublicacionPage,{
            user: this.userSession
        });
    }

    goDetallePublicacion(json_publicacion){
        this.navCtrl.push(DetallePublicacionPage,{
            user: this.userSession,
            publicacion: json_publicacion 
        });
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

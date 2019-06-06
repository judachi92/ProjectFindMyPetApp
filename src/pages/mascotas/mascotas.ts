import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from "@ionic-native/http";
import { CrearMascotasPage } from '../crearMascotas/crearMascotas';
import { ActualizarMascotas } from '../actualizarMascotas/actualizarMascotas';

@Component({
  selector: 'page-mascotas',
  templateUrl: 'mascotas.html'
})
export class MascotasPage implements OnInit{

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
        this.userSession = new Usuario();
        this.userSession = navParams.data;
        console.log(this.userSession);
    }

    ngOnInit(): void {
        this.listarMascotas();
    }

    listarMascotas(){
        let loading = this.loadingCtr.create({
            content: 'Consultando las Mascotas por usuario...'
        });
        loading.present();
        this.header['Accept'] = 'application/json';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        this.http.clearCookies();
        this.http.get('http://190.85.111.58:1088/FMpet/public/api/core/mascotas?limit=999&PERS_ID='+this.userSession.persona_id,
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.dataurl=JSON.parse(res.data);
                    
                    this.data = this.dataurl.data;
                    console.log(this.data);
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
                return (item.MASC_NOMBRE.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.MASC_TIPO.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    ((''+item.MASC_EDAD).toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }

    goEditarMascotas(mascota){
        this.navCtrl.push(ActualizarMascotas,{
            user: this.userSession ,
            mascota: mascota
        });
    }
    goCrearMascotas(){
        this.navCtrl.push(CrearMascotasPage,{
            user: this.userSession 
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

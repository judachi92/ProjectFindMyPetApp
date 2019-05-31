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
        let loading = this.loadingCtrl.create({
            content: 'Registrando Mascota. Por favor, espere...'
        });
        loading.present();

        this.header['Accept'] = ':application/json';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        
        this.http.clearCookies();
        this.http.post('http://190.85.111.58:1088/FMpet/public/api/core/mascotas',
            {
                MASC_NOMBRE: this.mascotaModel.nombre,
                MASC_EDAD: this.mascotaModel.edad,
                MASC_TIPO: this.mascotaModel.tipo,
                MASC_DESCRIPCION: this.mascotaModel.descripcion,
                PERS_ID: this.userSession.id
            },
            this.header)
            .then(res =>{
                this.zone.run(()=>{
                    console.log(res.data);
                    this.data=JSON.parse(res.data);
                    loading.dismiss();
                    if(this.data.status){
                        this.alert('Registro','La Mascota ha sido registrada exitosamente');
                        this.navCtrl.setRoot(IndexPage,{
                            user: this.userSession
                        });
                    }else{
                        this.alert('Error Registro',this.data.messge);
                    }
                });
            }).catch(e =>{
                console.log(e);
                loading.dismiss();
                this.alert('Error',e);
            }
        );
    }

}

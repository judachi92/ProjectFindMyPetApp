import {Component, NgZone} from '@angular/core';
import {NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from '@ionic-native/http';
import {IndexPage} from "../index/index";
import { Publicacion } from '../../models/publicacion';

import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-crearPublicacion',
  templateUrl: 'crearPublicacion.html'
})

export class CrearPublicacionPage {


    userSession: Usuario;
    publicacionModel:Publicacion;

    header: any = {};
    list_mascotas: any ;
    dataurl: any = {};

    image:string= null;

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,
        public zone: NgZone,
        public camera: Camera,) {

            this.userSession = navParams.data.user;
            this.getMascotasPersona();
            this.publicacionModel = new Publicacion();
    }

   
    alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    getMascotasPersona(){
        let loading = this.loadingCtrl.create({
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
                    
                    this.list_mascotas = this.dataurl.data;
                    console.log(this.list_mascotas);
                    loading.dismiss();
                });
            }).catch(e =>{
                this.alert('error',''+e);
                loading.dismiss();
            });
    }

    getPicture(sourceType:number){
        let options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 100,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType:sourceType,
        }
        this.camera.getPicture( options )
        .then(imageData => {
            this.image = `data:image/jpeg;base64,${imageData}`;
        })
        .catch(error =>{
            console.error( error );
        });
    }
}

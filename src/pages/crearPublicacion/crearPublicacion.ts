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
    data: any ;
    list_mascotas: any ;
    slides: {pos:string,image: string}[];
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

            this.initSlides();
    }

    initSlides(){
        this.slides = [
            {
              pos: "1",
              image: null,
            },
            {
                pos: "2",
                image: null,
            },
            {
                pos: "3",
                image: null,
            },
          ];
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

    getPicture(sourceType:number, index:number){
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
            this.slides[index].image = `data:image/jpeg;base64,${imageData}`;
        })
        .catch(error =>{
            console.error( error );
        });
    }

    registrarPublicacion(){
        let loading = this.loadingCtrl.create({
            content: 'Registrando Publicacion. Por favor, espere...'
        });
        loading.present();

        this.header['Accept'] = 'application/json';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        this.header['Content-Type'] = 'multipart/form-data';
        let body = {
            PUBL_TITULO: this.publicacionModel.titulo,
            PUBL_DESCRIPCION: this.publicacionModel.descripcion,
            PUBL_LATITUD: 3.4142882 ,
            PUBL_LONGITUD:-76.4708868 ,
            PUES_ID:1,
            PUTI_ID: this.publicacionModel.tipo_publicacion,
            PERS_ID: this.userSession.persona_id,
            MASC_ID: this.publicacionModel.mascota_id,
            BARR_ID: 319,
            arrAdjuntos: this.slides
        };
        console.log(body);
        this.http.clearCookies();
        this.http.post('http://190.85.111.58:1088/FMpet/public/api/core/publicaciones',
            body,
            this.header)
            .then(res =>{
                this.zone.run(()=>{
                    console.log(res.data);
                    this.data=JSON.parse(res.data);
                    loading.dismiss();
                    if(this.data.status){
                        this.alert('Registro','La Publicacion ha sido registrada exitosamente');
                        this.publicacionModel = new Publicacion();
                        this.initSlides();
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

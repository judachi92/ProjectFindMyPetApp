import {Component, NgZone} from '@angular/core';
import {NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from '@ionic-native/http';
import {IndexPage} from "../index/index";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Mascota } from '../../models/mascota';

@Component({
  selector: 'page-actualizarMascotas',
  templateUrl: 'actualizarMascotas.html'
})

export class ActualizarMascotas {


    userSession: Usuario;
    mascotaModel: Mascota;
    image: string = null;
    header: any = {};
    data: any = {};

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,
        public zone: NgZone,
        public camera: Camera,) {

            this.mascotaModel = new Mascota();
            this.userSession = navParams.data.user;
            let mascotaJson = navParams.data.mascota;
            this.mascotaModel.id = mascotaJson.MASC_ID;
            this.mascotaModel.nombre = mascotaJson.MASC_NOMBRE;
            this.mascotaModel.edad = mascotaJson.MASC_EDAD;
            this.mascotaModel.tipo = mascotaJson.MASC_TIPO;
            this.mascotaModel.descripcion = mascotaJson.MASC_DESCRIPCION;
            this.mascotaModel.person_id = mascotaJson.PERS_ID;
    }

   
    alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    actualizarMascota(){
        let loading = this.loadingCtrl.create({
            content: 'Actualizando Mascota. Por favor, espere...'
        });
        loading.present();

        this.header['Accept'] = ':application/json';
        this.header['Content-Type'] = 'multipart/form-data';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        
        this.http.clearCookies();
        this.http.put('http://190.85.111.58:1088/FMpet/public/api/core/mascotas/'+this.mascotaModel.id,
            {
                MASC_NOMBRE: this.mascotaModel.nombre,
                MASC_EDAD: this.mascotaModel.edad,
                MASC_TIPO: this.mascotaModel.tipo,
                MASC_DESCRIPCION: this.mascotaModel.descripcion,
                PERS_ID: this.mascotaModel.person_id,
                MASC_FOTO: this.image
            },
            this.header)
            .then(res =>{
                this.zone.run(()=>{
                    console.log(res.data);
                    this.data=JSON.parse(res.data);
                    loading.dismiss();
                    if(this.data.status){
                        this.alert('Actualizacion','La Mascota ha sido actualizada exitosamente');
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

    goEliminarMascota(){
        const confirm = this.alertCtrl.create({
            title: 'Eliminar Mascota',
            message: 'Se encuentra seguro de eliminar la Mascota',
            buttons: [
              {
                text: 'Aceptar',
                handler: () => {
                  this.eliminarMascota();
                }
              },
              {
                text: 'Cancelar',
                handler: () => {
                  console.log('Cancelo');
                }
              }
            ]
          });
          confirm.present();
    }

    eliminarMascota(){
        let loading = this.loadingCtrl.create({
            content: 'Eliminando Mascota. Por favor, espere...'
        });
        loading.present();

        this.header['Accept'] = ':application/json';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        this.header['Content-Type'] = 'multipart/form-data';
        this.http.clearCookies();
        this.http.delete('http://190.85.111.58:1088/FMpet/public/api/core/mascotas/'+this.mascotaModel.id,
            {},
            this.header)
            .then(res =>{
                this.zone.run(()=>{
                    console.log(res.data);
                    this.data=JSON.parse(res.data);
                    loading.dismiss();
                    if(this.data.status){
                        this.alert('Actualizacion','La Mascota ha sido eliminada exitosamente');
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

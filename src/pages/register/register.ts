import {Component, NgZone} from '@angular/core';
import {NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from '@ionic-native/http';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {


    userModel: Usuario;
    header: any = {};
    data: any = {};
    image: string = null;

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,
        public zone: NgZone,
        public camera: Camera,) {
        this.userModel = new Usuario();
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
    
    alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    registrarUsuario(){
        let loading = this.loadingCtrl.create({
            content: 'Registrando usuario. Por favor, espere...'
        });
        loading.present();

        this.header['Accept'] = ':application/json';
        this.header['Content-Type'] = 'multipart/form-data';
        this.http.clearCookies();
        this.http.post('http://190.85.111.58:1088/FMpet/public/api/users',
            {
                nombres: this.userModel.nombre,
                apellidos: this.userModel.apellido,
                cedula: this.userModel.cedula,
                email: this.userModel.email,
                direccion: this.userModel.direccion,
                telefono: this.userModel.telefono,
                password:this.userModel.clave,
                password_confirmation:this.userModel.confirmar_clave,
                avatar: this.image
            },
            this.header)
            .then(res =>{
                this.zone.run(()=>{
                    console.log(res.data);
                    this.data=JSON.parse(res.data);
                    loading.dismiss();
                    if(this.data.status){
                        this.alert('Registro','El Usuario ha sido registrado exitosamente');
                        this.navCtrl.setRoot(HomePage,{});
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

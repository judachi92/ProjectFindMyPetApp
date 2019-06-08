import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HTTP} from "@ionic-native/http";
import {Usuario} from "../../models/usuario";
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-perfilUsuario',
  templateUrl: 'perfilUsuario.html'
})
export class PerfilUsuarioPage implements OnInit{

    dataurl: any = [];
    data: any = [];
    image:string = null;
    header: any = {};

    userSession: Usuario;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public http: HTTP,
                public zone: NgZone,
                public loadingCtr:LoadingController,
                public camera: Camera, )
    {
        
        this.userSession = new Usuario();
        this.userSession = navParams.data;
        console.log(this.userSession);
    }

    ngOnInit(): void {
    }

    ActualizarUsuario(){
        let loading = this.loadingCtr.create({
            content: 'Registrando usuario. Por favor, espere...'
        });
        loading.present();

        this.header['Accept'] = ':application/json';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        this.header['Content-Type'] = 'multipart/form-data';
        this.http.clearCookies();

        let body = {
            nombres: this.userSession.nombre,
            apellidos: this.userSession.apellido,
            direccion: this.userSession.direccion,
            telefono: this.userSession.telefono,
            password:this.userSession.clave,
            password_confirmation:this.userSession.confirmar_clave
        };
        console.log(body);
        this.http.put('http://190.85.111.58:1088/FMpet/public/api/users/'+this.userSession.id,
            body,
            this.header)
            .then(res =>{
                this.zone.run(()=>{
                    console.log(res.data);
                    this.data=JSON.parse(res.data);
                    loading.dismiss();
                    if(this.data.status){
                        this.alert('Usuario','El Usuario ha sido Actualizado exitosamente');
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
    
    alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    getPicture(){
        let options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 100
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

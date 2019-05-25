import {Component, NgZone} from '@angular/core';
import {NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from '@ionic-native/http';
import { IndexPage } from '../index';

@Component({
  selector: 'page-detallePublicacion',
  templateUrl: 'detallePublicacion.html'
})

export class DetallePublicacionPage {


    userSession: Usuario;
    publicacion:any={};
    header: any = {};
    data: any = {};
    dataurl: any = {};

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,
        public zone: NgZone,) {

        this.userSession = navParams.data.user;
        this.publicacion = navParams.data.publicacion;
    }
    
    registrarComentario() {
      let loading = this.loadingCtrl.create({
        content: 'Consultando las Publicaciones...'
      });
      loading.present();
      this.header['Accept'] = 'application/json';
      this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
      this.http.clearCookies();
      this.http.post('http://190.85.111.58:1088/FMpet/public/api/core/comentario',
        {
            persona_id: this.userSession.id
        },this.header)
          .then(res =>{
              this.zone.run(()=>{
                console.log(res.data);
                this.data=JSON.parse(res.data);
                loading.dismiss();
                if(this.data.status){
                    this.alert('Comentario','El comentario ha sido registrado exitosamente');
                    this.navCtrl.setRoot(IndexPage,{
                      user: this.userSession
                  });
                }else{
                    this.alert('Error Registro',this.data.messge);
                }
              });
          }).catch(e =>{
              this.alert('error',''+e);
              loading.dismiss();
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

    crearComentario() {
      const prompt = this.alertCtrl.create({
        title: 'Registrar Comentario',
        message: "Ingresa tu comentario sobre la Publicación:",
        inputs: [
          {
            name: 'comentario',
            type: 'textarea',
            placeholder: 'Comentario'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Guardar',
            handler: data => {
              this.alert('Comentario',data.comentario);
            }
          }
        ]
      });
      prompt.present();
    }
}

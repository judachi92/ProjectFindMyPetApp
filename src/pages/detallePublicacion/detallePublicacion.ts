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
    list_mascotas: any = {};

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,
        public zone: NgZone,) {

        this.userSession = navParams.data.user;
        this.publicacion = navParams.data.publicacion;
        //this.getMascotasPersona();
    }
    
    registrarComentario(data:any) {
      let loading = this.loadingCtrl.create({
        content: 'Registrando Comentario. Por favor, espere...'
      });
      loading.present();
      this.header['Accept'] = 'application/json';
      this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
      
      let body = {
        COME_DESCRIPCION: data.comentario,
        PUBL_ID: this.publicacion.PUBL_ID
      };
      console.log(body);
      this.http.clearCookies();
      this.http.post('http://190.85.111.58:1088/FMpet/public/api/core/comentarios',
        body,this.header)
          .then(res =>{
              this.zone.run(()=>{
                console.log(res.data);
                this.data=JSON.parse(res.data);
                loading.dismiss();
                if(this.data.status){
                    this.alert('Comentario','El comentario ha sido registrado exitosamente');
                }else{
                    this.alert('Error Registro',this.data.messge);
                }
              });
          }).catch(e =>{
            console.log(e);
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
              this.registrarComentario(data);
              //this.alert('Comentario',data.comentario);
            }
          }
        ]
      });
      prompt.present();
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
}

import {Component, NgZone} from '@angular/core';
import {NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from '@ionic-native/http';
import {IndexPage} from "../index";
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


    userModel: Usuario;
    header: any = {};
    data: any = {};
    json: any = {};
    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,public http2: HTTP,
        public zone: NgZone,) {
        this.userModel = new Usuario();
    }

    signIn2() {
        this.navCtrl.setRoot(IndexPage,{
            user: null
        });
    }

    signIn() {
        let loading = this.loadingCtrl.create({
            content: 'Iniciando sesión. Por favor, espere...'
        });
        loading.present();

        this.header['Content-Type'] = 'application/x-www-form-urlencoded';
        this.http.clearCookies();
        this.http.post('http://190.85.111.58:1088/FMpet/public/oauth/token',
            {
                client_id:2,
                client_secret:'UW59wSYQ2bjP5LqS6hAygpfHSzq37jamkKHJI7VX',
                grant_type:'password',
                scope:'*',
                username:(this.userModel.email).toLowerCase(),
                password:this.userModel.clave
            },
            this.header)
            .then(res =>{
                this.zone.run(()=>{
                    console.log(res.data);
                    this.data=JSON.parse(res.data);
                    
                    this.userModel.access_token = this.data.access_token;
                    this.userModel.token_type = this.data.token_type;

                    this.header={};
                    this.header['Accept'] = ':application/json';
                    this.header['Authorization'] = this.userModel.token_type+' '+this.userModel.access_token;
                        
                    this.http2.clearCookies();
                    this.http2.get('http://190.85.111.58:1088/FMpet/public/api/getPersonaUser ',
                        {}, this.header).then(res2 =>{
                            this.zone.run(()=>{
                                console.log(res2.data);
                                this.json=JSON.parse(res2.data);
                                loading.dismiss();
                                this.userModel.nombre = this.json.data.persona.PERS_NOMBRE;
                                this.userModel.apellido = this.json.data.persona.PERS_APELLIDO;
                                this.userModel.email = this.json.data.persona.PERS_CORREO;
                                this.userModel.username = this.json.data.username;
                                this.userModel.avatar = this.json.data.avatar;
                                this.userModel.id=this.json.data.id;
                                if(this.json.data.persona){
                                    this.userModel.persona_id =this.json.data.persona.PERS_ID; 
                                }else{
                                    this.userModel.persona_id = this.json.data.id;
                                }
                                this.userModel.cedula=this.json.data.persona.PERS_NUMEROIDENTIFICACION;
                                this.userModel.telefono=this.json.data.persona.PERS_TELEFONO;
                                this.userModel.direccion=this.json.data.persona.PERS_DIRECCION;
                                this.userModel.clave="";
                                this.userModel.confirmar_clave="";
                                this.navCtrl.setRoot(IndexPage,{
                                    user: this.userModel
                                });
                                
                            });
                        }).catch(e =>{
                            console.log(e);
                            loading.dismiss();
                            this.alert('Error',e);
                        }
                    );
                });
            }).catch(e =>{
                console.log(e);
                loading.dismiss();
                this.alert('Autenticacion','Usuario y/o Clave incorrectos');
            }
        );
    }


    goRegistrer(){
        this.navCtrl.push(RegisterPage, {
           
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

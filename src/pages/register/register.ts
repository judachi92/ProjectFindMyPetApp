import {Component, NgZone} from '@angular/core';
import {NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from '@ionic-native/http';
import {IndexPage} from "../index";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {


    userModel: Usuario;
    header: any = {};
    data: any = {};

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,
        public zone: NgZone,) {
        this.userModel = new Usuario();
    }

    signIn() {
        this.navCtrl.setRoot(IndexPage,{
            user: null
        });
    }

    signIn2() {
        let loading = this.loadingCtrl.create({
            content: 'Iniciando sesión. Por favor, espere...'
        });
        loading.present();

        this.header['Cache-Control'] = 'no-cache';
        this.http.clearCookies();
        this.http.get('http://181.118.148.8:81/OfertasLaborales/public/loginWebservice?username='
                        +this.userModel.username+'&password='+this.userModel.password,
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    console.log(res.data);
                    this.data=JSON.parse(res.data);
                    loading.dismiss();
                    if(this.data != "ERR"){
                        this.userModel.id = this.data.id;
                        this.userModel.name = this.data.name;
                        this.userModel.email = this.data.email;
                        this.userModel.programa = this.data.programa;
                        this.userModel.codigo = this.data.codigo;

                        this.navCtrl.setRoot(IndexPage,{
                            user: this.userModel
                        });
                    }else{
                        this.alert('Autenticacion','Cedula y/o Clave son Incorrectos');
                    }
                });
            }).catch(e =>{
                console.log(e);
                loading.dismiss();
                this.alert('Autenticacion','Error en la conexion: '+e);
            }
        );
    }

    /**
     *
    <button ion-button full (click)="signIn2()">Entrar2</button>
    signIn2(){
        this.userModel.id = 3;
        this.userModel.username = '11111111';
        this.userModel.name = "Estudiante de pruebas";
        this.userModel.email = "estudiante@outlook.com";

        this.navCtrl.setRoot(IndexPage,{
            user: this.userModel
        });
    }**/


    alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}

import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from "@ionic-native/http";
import { CrearMascotasPage } from '../crearMascotas/crearMascotas';

@Component({
  selector: 'page-mascotas',
  templateUrl: 'mascotas.html'
})
export class MascotasPage implements OnInit{

    dataurl: any = [];
    data: any = [];
    header: any = {};

    userSession: Usuario;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public http: HTTP,
                public zone: NgZone,
                public loadingCtr:LoadingController)
    {
        this.userSession = navParams.data;
    }

    ngOnInit(): void {
        this.listarMascotas();
    }

    listarMascotas(){
        let loading = this.loadingCtr.create({
            content: 'Consultando las Publicaciones...'
        });
        loading.present();
        this.header['Accept'] = 'application/json';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        this.http.clearCookies();
        this.http.get('http://190.85.111.58:1088/FMpet/public/api/core/mascotas?limit=15',
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.dataurl=JSON.parse(res.data);
                    
                    this.data = this.dataurl.data;
                    
                    loading.dismiss();
                });
            }).catch(e =>{
                this.alert('error',''+e);
                loading.dismiss();
            });
    }


    getItems(ev) {
        this.data = this.dataurl.data;
        var val = ev.target.value;
        if (val && val.trim() != '') {
            this.data = this.data.filter(item =>  {
                return (item.PERS_NOMBREAPELLIDO.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.PUBL_DESCRIPCION.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    ((''+item.PUBL_FECHACREADO).toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }

    openWiew(objData){
        let alert = this.alertCtrl.create({
            title: 'Macotas',
            message: 'Deseas editar la informacion de la mascota',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.goEditarMascotas(objData);
                    }
                }
            ]
        });
        alert.present();
    }
    goEditarMascotas(mascota){

    }
    goCrearMascotas(){
        this.navCtrl.push(CrearMascotasPage,{
            user: this.userSession 
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

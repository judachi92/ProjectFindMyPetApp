import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HTTP} from "@ionic-native/http";
import {Usuario} from "../../models/usuario";

@Component({
  selector: 'page-perfilUsuario',
  templateUrl: 'perfilUsuario.html'
})
export class PerfilUsuarioPage implements OnInit{

    dataurl: any = [];
    data: any = [];
    header: any = {};

    userSession: Usuario;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public http: HTTP,
                public zone: NgZone,
                public loadingCtr:LoadingController )
    {
        this.userSession = navParams.data;
    }

    ngOnInit(): void {
        this.listarVacantesxUsuario();
    }

    listarVacantesxUsuario(){
        let loading = this.loadingCtr.create({
            content: 'Consultando las Vacantes del Usuario...'
        });
        loading.present();
        this.header['Cache-Control'] = 'no-cache';
        this.http.clearCookies();
        this.http.get('http://181.118.148.8:81/OfertasLaborales/public/getVacantes?user_id='+this.userSession.id,
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.dataurl=JSON.parse(res.data);
                    this.data = this.dataurl;
                    loading.dismiss();
                });
            }).catch(e =>{
            console.log(e);
            loading.dismiss();
        });
    }


    getItems(ev) {
        this.data = this.dataurl;
        var val = ev.target.value;
        if (val && val.trim() != '') {
            this.data = this.data.filter(item =>  {
                return (item.Cargo.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.Nombre.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    ((''+item.id).toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }

    openWiew(objData){
        let alert = this.alertCtrl.create({
            title: 'Informacion Vacante',
            message: 'Quieres Cancelar la Peticion Vacante',
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
                        this.CancelarVacante(objData);
                    }
                }
            ]
        });
        alert.present();
    }

    CancelarVacante(vacante){
        let loading = this.loadingCtr.create({
            content: 'Por favor espere...'
        });
        loading.present();
        this.header['Cache-Control'] = 'no-cache';
        this.http.clearCookies();
        this.http.get('http://181.118.148.8:81/OfertasLaborales/public/noPostularVacante?vacante_id='+vacante.id+'&user_id='+this.userSession.id,
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.dataurl=JSON.parse(res.data);
                    this.data = this.dataurl;
                    let mensaje = "";
                    if(this.dataurl.status){
                        mensaje="Se Cancelo la Peticion Correctamente"
                    }else{
                        mensaje="No Existe Solicitud registrada al Usuario";
                    }
                    this.alert('Informacion Vacante',mensaje);
                    loading.dismiss();
                    this.listarVacantesxUsuario();
                });
            }).catch(e =>{
            console.log(e);
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

}

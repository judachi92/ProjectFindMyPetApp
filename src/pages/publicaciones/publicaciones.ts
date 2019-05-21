import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from "@ionic-native/http";

@Component({
  selector: 'page-publicaciones',
  templateUrl: 'publicaciones.html'
})
export class PublicacionesPage implements OnInit{

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
        this.listarPublicaciones();
    }

    listarPublicaciones(){
        let loading = this.loadingCtr.create({
            content: 'Consultando las Publicaciones...'
        });
        loading.present();
        this.header['Accept'] = 'application/json';
        this.header['Authorization'] = this.userSession.token_type+' '+this.userSession.access_token;
        this.http.clearCookies();
        this.http.get('http://190.85.111.58:1088/FMpet/public/api/core/publicaciones?PERS_ID=2',
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.dataurl=JSON.parse(res.data);
                    
                    this.data = this.dataurl;
                    
                    loading.dismiss();
                });
            }).catch(e =>{
                this.alert('error',''+e);
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
            message: 'Quieres postularte a la Vacante',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Postularse',
                    handler: () => {
                        this.postularseVacante(objData);
                    }
                }
            ]
        });
        alert.present();
    }

    postularseVacante(vacante){
        let loading = this.loadingCtr.create({
            content: 'Por favor espere...'
        });
        loading.present();
        this.header['Cache-Control'] = 'no-cache';
        this.http.clearCookies();
        this.http.get('http://181.118.148.8:81/OfertasLaborales/public/postularVacante?vacante_id='+vacante.id+'&user_id='+this.userSession.id,
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.dataurl=JSON.parse(res.data);
                    this.alert('Informacion Vacante',this.dataurl.msg);
                    loading.dismiss();
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

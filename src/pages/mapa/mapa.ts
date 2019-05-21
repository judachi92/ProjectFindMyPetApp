import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Usuario} from "../../models/usuario";
import {HTTP} from "@ionic-native/http";
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {Vacante} from "../../models/vacante";
declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage implements OnInit{

    map:any;
    loading: any;
    userSession: Usuario;

    data: any = [];
    dataurl: any = [];
    header: any = {};

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public http: HTTP,
        public zone: NgZone,
        private geolocation:Geolocation)
    {
        this.userSession = navParams.data;
    }

    ngOnInit(): void {
        this.cargarMapa();
    }

    cargarMapa(){
        this.loading = this.loadingCtrl.create({
            content: 'Cargando Mapa ...'
        });
        this.loading.present();
        this.listaVacantes();
    }


    listaVacantes(){
        this.header['Cache-Control'] = 'no-cache';
        this.http.clearCookies();
        this.http.get('http://181.118.148.8:81/OfertasLaborales/public/getVacantes',
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.data=JSON.parse(res.data);
                    this.getPosition();
                });
            }).catch(e =>{
            console.log(e);
        });
    }

    getPosition():any{
        //activado permiso
        this.geolocation.getCurrentPosition().then(response =>{
            this.loadMap(response);
        })
    }

    loadMap(position: Geoposition){
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        console.log(latitude,longitude);

        let mapEle: HTMLElement = document.getElementById('map');
        let MyLatLng = {lat: latitude, lng: longitude};

        this.map = new google.maps.Map(mapEle,{
            center: MyLatLng,
            zoom: 12
        });

        google.maps.event.addListenerOnce(this.map, 'idle',()=>{

            /*llenado de markadores*/
            for (let i=0;i<this.data.length;i++){
                let vacante:Vacante = this.data[i];

                let MyLatLng = {lat: parseFloat(vacante.latitud), lng: parseFloat(vacante.longitud)};
                let marker = new google.maps.Marker({
                    position: MyLatLng,
                    map: this.map,
                    title: vacante.Cargo + ' en ' + vacante.Nombre
                });

                marker.addListener('click', () => {
                    this.mensajewindow(vacante);
                });

            }
            mapEle.classList.add('show-map');
            this.loading.dismiss();
        });

    }

    mensajewindow(vacante:Vacante){
        let mensaje='<b>Cargo:</b>'+ vacante.Cargo + ' <br>' +
            '<b>Empresa: </b>'+ vacante.Nombre + '<br>' +
            '<b>Direccion: </b>'+vacante.Direccion+ '<br>' +
            '<b>Fecha: </b>'+vacante.Fecha ;
        let alert = this.alertCtrl.create({
            title: 'Informacion Vacante',
            message: mensaje,
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
                        this.postularseVacante(vacante);
                    }
                }
            ]
        });
        alert.present();
    }

    postularseVacante(vacante){
        let loading = this.loadingCtrl.create({
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

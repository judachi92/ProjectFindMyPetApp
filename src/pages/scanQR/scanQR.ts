import {Component, NgZone} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import {Vacante} from "../../models/vacante";
import {Usuario} from "../../models/usuario";
import {HTTP} from "@ionic-native/http";

@Component({
    selector: 'page-scanQR',
    templateUrl: 'scanQR.html'
})
export class ScanQRPage {

    data={ };
    dataurl: any = [];
    header: any = {};
    vacanteScan:Vacante;
    userSession: Usuario;

    option:BarcodeScannerOptions ;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public http: HTTP,
                public zone: NgZone,
                public loadingCtr:LoadingController,
                public barcodeScanner:BarcodeScanner) {

        this.vacanteScan = null;
        this.userSession = navParams.data;
    }

    scan(){
        this.option = {
            prompt: "Please scan your code"
        }
        this.barcodeScanner.scan(this.option).then((barcodeData) => {
            // Success! Barcode data is here
            this.vacanteScan = JSON.parse(barcodeData.text);
        }, (err) => {
            // An error occurred
            console.log(err);
        });
    }

    postularseVacante(){
        let loading = this.loadingCtr.create({
            content: 'Por favor espere...'
        });
        loading.present();
        this.header['Cache-Control'] = 'no-cache';
        this.http.clearCookies();
        this.http.get('http://181.118.148.8:81/OfertasLaborales/public/postularVacante?vacante_id='+this.vacanteScan.id+'&user_id='+this.userSession.id,
            {},this.header)
            .then(res =>{
                this.zone.run(()=>{
                    this.dataurl=JSON.parse(res.data);
                    this.alert('Informacion Vacante',this.dataurl.msg);
                    loading.dismiss();
                    this.vacanteScan = null;
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

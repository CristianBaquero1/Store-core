import { Inject, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController,ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { __await } from 'tslib';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  alertCtrl = inject(AlertController);

  

async takePicture (promptLabelHeader: string) {
  return  await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source:CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto : 'Selecciona una foto',
    promptLabelPicture :'Toma una foto'
  });

  
};
//=============alerta========
async presentAlert(opts?: AlertOptions) {
  const alert = await this.alertCtrl.create(opts);

  await alert.present();
}

  //==============Loading================

  loading(){
    return this.loadingCtrl.create({spinner :'bubbles' })
  }
  
  //==============Toast================
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtl.create(opts);
    toast.present();
  }
   
  //============Navegacion========

    routerLink(url:string ){
      return this.router.navigateByUrl(url);
    }
  //============guardar en local========

saveInLocalStorage(key: string, value: any){
  return localStorage.setItem(key,JSON.stringify(value));
}
//================obtener los guardado==========

getFromLocalStorage(key: string){
return JSON.parse(localStorage.getItem(key)) ;
}

//============ Modal ==========
async presentModal(opts: ModalOptions){
  const modal = await this.modalCtrl.create(opts);

  await modal.present();
  const {data} = await modal.onWillDismiss();
  if (data) return data;
}
dismissModal(data?:any){
  return this.modalCtrl.dismiss(data);
}

}

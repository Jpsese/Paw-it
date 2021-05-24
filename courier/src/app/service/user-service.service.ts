import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private toastController: ToastController, private loadingController: LoadingController) { }

  async showMessage(message, color) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2000,
      color: color,
      animated: true,
      cssClass: 'toastMessage'
    })
    return toast.present();
  }

  async loadingSpinner(message) {
    let loading = this.loadingController.create({
      cssClass: 'loading-spinner',
      message: message,
      spinner: 'crescent',
      duration: 3000
    })
    return await loading;
  }


}

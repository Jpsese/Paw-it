import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor(private db: AngularFireDatabase, private af: AngularFireAuth,
    private toastController: ToastController, private loadingController: LoadingController) {

  }


  details(id) {
    console.log(id);
    return this.db.list(`sellerProfile`, ref => ref.orderByChild('email').equalTo(id)).snapshotChanges();
  }

  signOut() {
    this.af.auth.signOut();
  }


  async loadingSpinner(message) {
    let loading = this.loadingController.create({
      message: message,
      spinner: 'crescent',
      cssClass: 'loading-spinner',
      duration: 3000
    })

    return await loading;
  }

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
  deliveryRun() {
    return this.db.list(`/sysConf/deliveryRun`).snapshotChanges();
  }

  minMaxDate() {
    return this.db.list(`/sysConf`).snapshotChanges();
  }
}
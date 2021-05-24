import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(private alertController: AlertController,
    private af: AngularFireAuth, ) {

  }
  signOut() {
    this.af.auth.signOut();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'logout',
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'logout-cancel'
        }, {
          text: 'YES',
          cssClass: 'logout-confirm',
          handler: () => {
            this.af.auth.signOut();
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
  }

}

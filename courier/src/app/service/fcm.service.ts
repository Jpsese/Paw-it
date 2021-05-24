import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private db: AngularFireDatabase, private platform: Platform, private af: AngularFireAuth,
    private firebaseNative: Firebase) { }

  async getToken(userId) {

    if (this.platform.is('android')) {

      await this.firebaseNative.getToken().then((token) => {
        this.saveTokenToFirebase(userId, token);
      })
    }

    if (this.platform.is('ios')) {
      await this.firebaseNative.getToken().then((token) => {
        this.saveTokenToFirebase(userId, token);
      })
    }

  }

  private saveTokenToFirebase(userId, token) {
    if (userId != null) {
      return this.db.database.ref(`devices/courier/${userId}`).set({
        'token': token
      }).then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error);
      });
    }


  }

  listenToNotification() {
    return this.firebaseNative.onNotificationOpen();
  }
}

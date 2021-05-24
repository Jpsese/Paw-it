import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './service/fcm.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserServiceService } from './service/user-service.service';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  isConnected = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private af: AngularFireAuth,
    private toastCtrl: ToastController,
    private db: AngularFireDatabase,
    private userService: UserServiceService,
    private network: Network
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.network.onDisconnect().subscribe(() => {
        this.isConnected = false;
      })
      this.network.onConnect().subscribe(() => {
        this.isConnected = true;
      })

      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', (event) => {
          event.preventDefault();
          event.stopPropagation();
        }, false)
      })
      let userId;
      this.af.authState.subscribe((user) => {
        if (user) {
          userId = user.uid;
        }
        this.fcm.getToken(userId);

      });


      //     this.fcm.listenToNotification().pipe(
      //       tap(async msg => {
      //         const toast = await this.toastCtrl.create({
      //           message: msg.body,
      //           duration: 5000
      //         });
      //         await toast.present()
      //       })
      //     ).subscribe();
      //   });
      //   let watch = this.geolocation.watchPosition();
      //   watch.subscribe((data) => {
      //     this.updateLocation(data.coords.latitude, data.coords.longitude);
      //   })
      // }

      // updateLocation(lat, lng) {
      //   this.af.authState.subscribe((user) => {
      //     if (user) {
      //       this.db.database.ref(`couriers/${user.uid}/`).update({
      //         currentLocation: {
      //           lat: lat,
      //           lng: lng
      //         }
      //       })
      //     }
      //   })
    })
  }

}

import { Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireDatabase } from 'angularfire2/database';
import { FcmService } from './service/fcm.service';
import { Firebase } from '@ionic-native/firebase/ngx';
import { tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];
  isConnected = true;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private toastCtrl: ToastController,
    private af: AngularFireAuth,
    private firebase: Firebase,
    private db: AngularFireDatabase,
    private network: Network
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      let userId;
      this.network.onDisconnect().subscribe(() => {
        this.isConnected = false;
      })
      this.network.onConnect().subscribe(() => {
        this.isConnected = true;
      })

      this.platform.backButton.subscribeWithPriority(9999, () =>{
        document.addEventListener('backbutton', (event) => {
          event.preventDefault();
          event.stopPropagation();
        }, false)
      })
      // this.db.database.ref().child(`.info/connected`).on('value', (connectedSnap) => {
      //   if (connectedSnap.val() === true) {
      //     // console.log('connected')
      //   } else {
      //     // console.log('not connected')
      //   }
      // })
      this.af.authState.subscribe((user) => {
        if (user) {
          userId = user.uid;
        }
        this.fcm.getToken(userId);

      });


      this.fcm.listenToNotification().pipe(
        tap(async msg => {
          const toast = await this.toastCtrl.create({
            message: msg.body,
            duration: 5000
          });
          await toast.present()
        })
      ).subscribe();
    });
  }
}

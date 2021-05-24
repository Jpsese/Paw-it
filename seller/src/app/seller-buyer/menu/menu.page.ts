import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDetailsService } from '../../service/user-details.service';
import { FcmService } from '../../service/fcm.service';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  details: any;
  user: any;

  constructor(private af: AngularFireAuth,
    private userService: UserDetailsService,
    private firebaseService: FcmService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.af.authState.subscribe(user => {
      this.userService.details(user.email).subscribe(value => {
        this.details = value.map(res => {
          return res.payload.val()
        })
      })
    })

  }

  signOut() {
    this.af.auth.signOut();
  }
 
}
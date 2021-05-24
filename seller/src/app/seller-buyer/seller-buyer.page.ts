import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform, ToastController, LoadingController } from '@ionic/angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserDetailsService } from '../service/user-details.service';
// import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-seller-buyer',
  templateUrl: './seller-buyer.page.html',
  styleUrls: ['./seller-buyer.page.scss'],
})
export class SellerBuyerPage implements OnInit {
  // private facebook: Facebook
  forms: FormGroup;
  constructor(private af: AngularFireAuth, private router: Router,
    private fb: FormBuilder, private gplus: GooglePlus, private platform: Platform,
    private userService: UserDetailsService, private db: AngularFireDatabase,) {
    this.forms = fb.group({
      'email': [null, Validators.required],
      'password': [null, Validators.required]
    })
  }
  register() {
    this.router.navigateByUrl('/register');
  }
  ngOnInit() {
    this.checkAuth();
  }

  loginForm(value) {
    this.userService.loadingSpinner('Logging in ...').then(res => {
      res.present();
      this.af.auth.signInWithEmailAndPassword(value.email, value.password).catch((error) => {
        if (error.code === "auth/network-request-failed") {
          this.userService.showMessage('Cannot login, No Internet connection', 'warning');
          res.dismiss();
        } else if (error.code === "auth/invalid-email") {
          this.userService.showMessage('Invalid email address', 'warning');
          res.dismiss();
        } else if (error.code === "auth/user-not-found") {
          this.userService.showMessage('No user registered with the email', 'warning');
          res.dismiss();
        } else if (error.code === "auth/wrong-password") {
          this.userService.showMessage('The password is incorrect', 'warning');
          res.dismiss();
        } else {
          this.userService.showMessage('There was an error while logging in', 'warning');
          res.dismiss();
        }
      })
    })
  }

  checkAuth() {
    this.af.auth.onAuthStateChanged(user => {
      if (user) {
        this.db.object<any>(`sellerProfile/${user.uid}`).valueChanges().subscribe(data => {
          // if (data.type === 'seller') {
          //   this.router.navigateByUrl('menu/seller/post-parcel');
          // } else {
          //   this.showErrorMessage('No user registered with the email');
          //   this.af.auth.signOut();
          // }
          if(data === null){
            this.userService.showMessage('No user registered with the email', 'warning');
            this.af.auth.signOut();
          } else {
            this.router.navigateByUrl('menu/seller/post-parcel')
          }
        })
      }
    });
  }
}

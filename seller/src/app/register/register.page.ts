import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { UserDetailsService } from '../service/user-details.service';
import { FcmService } from '../service/fcm.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  forms: FormGroup;
  breakdown: false;
  constructor(public afAuth: AngularFireAuth, private fb: FormBuilder, private router: Router,
    private db: AngularFireDatabase, private userService: UserDetailsService, private firebaseService: FcmService, private toastCtrl: ToastController, ) {
    this.forms = fb.group({
      'fname': [null, Validators.required],
      'lname': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'contactnum': [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'password': [null, Validators.required],
      'confpassword': [null, Validators.required],
    })
  }
  back() {
    this.router.navigateByUrl('/');
  }

  registerForm(post) {
    this.userService.loadingSpinner('Registering ...').then(res => {
      res.present();
      if (post.password === post.confpassword) {
        this.afAuth.auth.createUserWithEmailAndPassword(post.email, post.password).then((data) => {
          this.db.database.ref(`sellerProfile/${data.user.uid}`).set({
            firstName: post.fname,
            lastName: post.lname,
            email: post.email,
            contactNumber: post.contactnum,
          })

        }).catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            this.userService.showMessage('Email already registered', 'warning');
            res.dismiss();
          } else if (error.code === "auth/phone-number-already-exists") {
            this.userService.showMessage('Phone Number already registered', 'warning');
            res.dismiss();
          } else if (error.code === "auth/weak-password") {
            this.userService.showMessage('Password should be at least 6 characters', 'warning');
            res.dismiss();
          } else {
            console.log(error);
            res.dismiss();
          }
        })
      } else {
        this.userService.showMessage('Password does not match with the confirmation password', 'warning')
        res.dismiss();
      }
    })
  }
  ngOnInit() {
  }
  // openImagePicker() {
  //   this.imagePicker.hasReadPermission().then(
  //     (result) => {
  //       if (result == false) {
  //         // no callbacks required as this opens a popup which returns async
  //         this.imagePicker.requestReadPermission();
  //       }
  //       else if (result == true) {
  //         this.imagePicker.getPictures({
  //           maximumImagesCount: 1
  //         }).then(
  //           (results) => {
  //             // this.uploadImageToFirebase(results[0]);
  //           }, (err) => console.log(err)
  //         );
  //       }
  //     }, (err) => {
  //       console.log(err);
  //     });
  //     this.db.database.goOffline
  // }
  // uploadImageToFirebase(image) {
  //   this.firebaseService.uploadImage(image)
  //     .then(async photoURL => {

  //       const toast = await this.toastCtrl.create({
  //         message: 'Image was updated successfully',
  //         duration: 3000
  //       });
  //       toast.present();
  //     })
  // }





}

import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDetailsService } from '../../service/user-details.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public showContactInput = false;
  public showPasswordInput = false;
  details: any;
  user: any;
  formContact: FormGroup;
  formPassword: FormGroup;

  constructor(private af: AngularFireAuth, 
              private userService: UserDetailsService,
              private fb: FormBuilder,
              private db: AngularFireDatabase,
              public alertController: AlertController
              ) {
                this.formContact = fb.group({
                  'newcontactnum': [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
                }),
                this.formPassword = fb.group({
                  'oldpassword': [null, Validators.required],
                  'newpassword': [null, Validators.required],
                  'newconfpassword': [null, Validators.required],
                })
               }
  ngOnInit() {
    this.af.authState.subscribe(user => {
      this.userService.details(user.email).subscribe(value => {
        this.details = value.map(res => {
          return res.payload.val()
        })
      })
    })
  }
  async editContactPopup() {
    const alert = await this.alertController.create({
      header: 'Update Contact Number',
      message: 'Please fill-up the necessary forms.',
      inputs:[{
        name: 'Current',
        type: 'text',
        placeholder: 'Current contact #',
      },
      {
        name: 'New',
        type: 'text',
        placeholder: 'Enter new contact #',
      },
      {
        name: 'Confirm',
        type: 'text',
        placeholder: 'Confirm new contact #',
      }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //Enter function here 
          }
        }, {
          text: 'Save',
          handler: () => {
            //Enter function here
          }
        }
      ]
    });

    await alert.present();
  }
  async editPasswordPopup() {
    const alert = await this.alertController.create({
      header: 'Update Password',
      message: 'Please fill-up the necessary forms.',
      inputs:[{
        name: 'Currentpass',
        type: 'text',
        placeholder: 'Enter current password',
      },
      {
        name: 'Newpass',
        type: 'text',
        placeholder: 'Enter new password',
      },
      {
        name: 'Confirmpass',
        type: 'text',
        placeholder: 'Confirm new password',
      }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //Enter function here 
          }
        }, {
          text: 'Save',
          handler: () => {
            //Enter function here
          }
        }
      ]
    });

    await alert.present();
  }

  editContact(){
    this.showContactInput = !this.showContactInput;
    if(this.showPasswordInput == true){
      this.showPasswordInput = false;
    }
  }
  changePassword(){
    this.showPasswordInput = !this.showPasswordInput;
    if(this.showContactInput == true){
      this.showContactInput = false;
    }
  }
 
  updateContact(post){
    this.userService.loadingSpinner('Updating ...').then(res => {
      res.present();    
    if(post.newcontactnum != null){
      this.af.auth.onAuthStateChanged(user => {  
        this.db.database.ref(`sellerProfile/${user.uid}`).update({
          contactNumber: post.newcontactnum,
        })
      })
      this.userService.showMessage('Contact number updated successfully', 'success')
      res.dismiss();
      this.formContact.reset();
    }else{
      this.userService.showMessage('Error', 'warning')
      res.dismiss();
    }
    })
  }
  updatePassword(post){
    this.userService.loadingSpinner('Updating ...').then(res => {
    res.present();
    const current = firebase.auth().currentUser.email
    const credential = firebase.auth.EmailAuthProvider.credential(current, post.oldpassword);
    firebase.auth().currentUser.reauthenticateWithCredential(credential).then(
      success => {
        if(post.newpassword == post.newconfpassword){
          firebase.auth().currentUser.updatePassword(post.newpassword)
          this.userService.showMessage('Password updated successfully', 'success')
          res.dismiss();
          this.showPasswordInput = false;
        }else if(post.newpassword != post.newconfpassword){
          this.userService.showMessage('New password does not match with the new confirmation password', 'warning')
          res.dismiss();
        }else if(post.newpassword == post.oldpassword){
          this.userService.showMessage('New password is the same with the old password', 'warning')
          res.dismiss();
        }else{
          console.log(post.error);
        }
        this.formPassword.reset();
      }
    ).catch((error) => {
      if (error.code === "auth/wrong-password") {
        this.userService.showMessage('Wrong old password', 'warning');
        res.dismiss();
      }else{
        console.log(error);
      }
    })
    }) 
  }
  
}

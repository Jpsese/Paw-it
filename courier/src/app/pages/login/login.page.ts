import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { UserServiceService } from '../../service/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  forms: FormGroup;

  constructor(private af: AngularFireAuth, private fb: FormBuilder,
    private db: AngularFireDatabase, private router: Router, private userService: UserServiceService) {
    this.forms = fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  ngOnInit() {
    this.checkAuth();
  }

  //login forms
  loginForm(value) {
    this.userService.loadingSpinner('Logging in ...').then((res) => {
      res.present();
      this.af.auth.signInWithEmailAndPassword(value.email, value.password).catch(error => {
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
      this.db.object<any>(`couriers/${user.uid}`).valueChanges().subscribe(data => {
        if (data.email === null) {
          this.userService.showMessage('No user registered with the email', 'warning');
          this.db.database.ref(`couriers/${user.uid}`).remove();
          this.af.auth.signOut();
        } else {
          this.router.navigateByUrl('tabs/scheduled');
        }
      })
    });
  }
}

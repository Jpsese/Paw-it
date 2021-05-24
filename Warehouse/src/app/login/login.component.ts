import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  forms: FormGroup;
  constructor(private ngxService: NgxUiLoaderService, private db: AngularFireDatabase,
    private fb: FormBuilder, private af: AngularFireAuth, private router: Router) {
    this.forms = fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.required]
    })
  }

  ngOnInit() {
    this.ngxService.stop();

  }

  checkAuth() {
    this.af.auth.onAuthStateChanged(user => {
      console.log(user.uid);
      this.db.object<any>(`employees/${user.uid}`).valueChanges().subscribe(data => {
        if (data.role === 'Warehouse Manager') {
          this.router.navigateByUrl('/couriers');
        }else {
          this.af.auth.signOut();
        }
      })
    })
  }

  loginForms(post) {
    this.af.auth.signInWithEmailAndPassword(post.email, post.password).catch(error => {
      if (error.code === "auth/network-request-failed") {

      } else if (error.code === "auth/invalid-email") {
      } else if (error.code === "auth/user-not-found") {

      } else if (error.code === "auth/wrong-password") {

      } else {

      }
    }).then(() => {
      this.checkAuth();
    })
  }

}

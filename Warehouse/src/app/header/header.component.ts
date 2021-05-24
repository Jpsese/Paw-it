import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private af: AngularFireAuth) { }

  ngOnInit() {
  }

  logout(){
    this.af.auth.signOut();
    
  }

}

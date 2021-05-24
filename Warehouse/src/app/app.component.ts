import { Component } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showMenu = true;
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  title = 'Warehouse';
  spinner = SPINNER;
  constructor(private db: AngularFireDatabase, private ngxService: NgxUiLoaderService, public route: Router) {
    // Check connection state
    this.db.database.ref().child(`.info/connected`).on('value', (connectedSnap) => {
      if (connectedSnap.val() === true) { 
        this.ngxService.stop();
      } else {
        this.ngxService.start(); 
      }
    }),
    // Hide Menu when in login page
    route.events.forEach((event) => {
      if(event instanceof NavigationStart) {
          this.showMenu = event.url !== "/";
      }
    });
  }


  ngOnInit() {
    // Alternative to detecting when online/offline
    // this.onlineEvent = fromEvent(window, 'online');
    // this.offlineEvent = fromEvent(window, 'offline');

    // this.subscriptions.push(this.onlineEvent.subscribe(e => {
    //   this.ngxService.stop();
    // }));

    // this.subscriptions.push(this.offlineEvent.subscribe(e => {
    //   this.ngxService.start(); 
    // }));
  }

}


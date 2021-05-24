import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SellerBuyerAuthGuard implements CanActivate {

  constructor(private af: AngularFireAuth, private router: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.af.auth.onAuthStateChanged(user => {
        if (!user) {
          this.router.navigateByUrl('');
          return false;
        }
      })
      return true;
  }
}

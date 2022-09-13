/** @format */

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { AuthService } from '../app/services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public navc: NavController, public platform: Platform, public auth: AuthService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.platform.ready().then(async e => {
      const localUserId: string = localStorage.getItem('userId');

      if (localUserId) {
        return true;
      } else {
        this.navc.navigateRoot('/login');
        return false;
      }
    });
  }
}

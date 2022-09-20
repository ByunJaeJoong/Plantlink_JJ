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

  async canActivate(): Promise<boolean> {
    // const localUserId: string = localStorage.getItem('userId');
    const uid = await this.auth.uid();

    const isLoggedIn = !!uid;
    if (!isLoggedIn) {
      this.navc.navigateRoot('/login-join');
      return false;
    } else {
      return true;
    }
  }
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseX } from '@ionic-native/firebase-x';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class PhoneAuthService {
  constructor(public afa: AngularFireAuth, private platform: Platform) {}

  get isDesktop(): boolean {
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      return true;
    } else {
      return false;
    }
  }

  async one() {
    (window as any).recaptchaVerifier = await new firebase.default.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: function (response) {},
    });
    await (window as any).recaptchaVerifier.render();
  }

  async authentication(phone: string): Promise<string> {
    if (this.isDesktop && !this.platform.is('cordova')) {
      await this.one();
      firebase.default.auth().languageCode = 'ko';
      return this.authenticationDesktop(phone);
    } else {
      return this.authenticationPhone(phone);
    }
  }

  authenticationDesktop(phone: string): Promise<string> {
    return new Promise((resolve, reject) => {
      firebase.default
        .auth()
        .signInWithPhoneNumber(phone, (window as any).recaptchaVerifier)
        .then(confirmationResult => {
          resolve(String(confirmationResult.verificationId));
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  authenticationPhone(phone: string): Promise<string> {
    return new Promise((resolve, reject) => {
      FirebaseX.verifyPhoneNumber(phone, 60)
        .then(e => {
          resolve(String(e.verificationId));
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  complete(verificationId: string, certifyNum: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let signInCredential = firebase.default.auth.PhoneAuthProvider.credential(verificationId, certifyNum);
      firebase.default
        .auth()
        .signInWithCredential(signInCredential)
        .then(e => {
          resolve(e);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  async getAuthUid(): Promise<string> {
    return await firebase.default.auth().currentUser.uid;
  }
}

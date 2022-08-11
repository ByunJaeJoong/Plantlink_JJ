/** @format */

import { AngularFireAuth } from '@angular/fire/auth';
import { DbService } from './db.service';
import { AlertService } from './alert.service';
import { switchMap, take, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(public afAuth: AngularFireAuth, public db: DbService, public alertService: AlertService, public loadingService: LoadingService) {
    this.user$ = this.afAuth.authState.pipe(switchMap(user => (user ? db.doc$(`users/${user.uid}`) : of(null))));

    this.afAuth.authState.subscribe(data => {
      console.log('authState', data);
      if (data) {
        localStorage.setItem('userId', data.uid);
      } else {
        // 예외사항 고려
        // localStorage.clear();
      }
    });
  }

  // email + password 가입
  registerUser(email, password) {
    return new Promise<any>((resolve, reject) => {
      firebase.default
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          localStorage.setItem('userId', res.user.uid);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  loginUser(email, password) {
    return new Promise<any>((resolve, reject) => {
      firebase.default
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          res => resolve(res),
          err => reject(err)
        )
        .catch(err => reject(err));
    });
  }

  // 가입한 회원에게 이메일 인증 메일 발송
  sendEmailVerificationUser(user) {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        user
          .sendEmailVerification()
          .then(success => {
            resolve(success);
          })
          .catch(error => {
            let code = error['code'];
            this.alertService.showErrorMessage(code);

            reject(code);
          });
      }
    });
  }

  // 현재 currentUser 로그아웃
  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth
          .signOut()
          .then(() => {
            localStorage.clear();
            resolve(true);
          })
          .catch(error => {
            let code = error['code'];
            this.alertService.showErrorMessage(code);

            reject(code);
          });
      }
    });
  }

  // 현재 currentUser 회원탈퇴 (주의사항 : currentUser가 최신이 아닐 경우 재 로그인 필요)
  exitUser() {
    return new Promise((resolve, reject) => {
      this.afAuth.currentUser.then(user => {
        // this.db
        //   .updateAt(`users/${user.uid}`, { exitSwitch: true, exitDate: new Date().toISOString() })
        //   .then(() => { // 특이사항 고려 + 보통 exitSwitch 사용합니다.
        user
          .delete()
          .then(() => {
            localStorage.clear();
            resolve(true);
          })
          .catch(error => {
            let code = error['code'];
            this.alertService.showErrorMessage(code);

            reject(code);
          });
        // })
        // .catch(error => {
        //   reject(error);
        // });
      });
    });
  }

  // currentUser 정보 받아오기
  getUser() {
    return this.user$.pipe(take(1)).toPromise();
  }

  // currentUser uid 받아오기
  async uid() {
    return await (
      await this.afAuth.currentUser
    ).uid;
  }

  // currentUser 비밀번호 변경
  async changePassword(newPassword) {
    return new Promise((resolve, reject) => {
      this.afAuth.currentUser.then(user => {
        user
          .updatePassword(newPassword)
          .then(success => {
            resolve(success);
          })
          .catch(error => {
            let code = error['code'];
            this.alertService.showErrorMessage(code);

            reject(code);
          });
      });
    });
  }

  // 비밀번호 재설정 메일 발송
  sendPasswordReset(email) {
    return new Promise((resolve, reject) => {
      // this.loadingService.load("비밀번호 재설정 메일을 발송중입니다.");
      return this.afAuth
        .sendPasswordResetEmail(email)
        .then(success => {
          // this.loadingService.hide();
          // this.alertService.presentAlert("비밀번호 재설정", "이메일으로 비밀번호 재설정 이메일이 전송되었습니다. 이메일을 확인해 주세요.");
          resolve(success);
        })
        .catch(error => {
          let code = error['code'];
          this.alertService.showErrorMessage(code);

          reject(code);
        });
    });
  }
}

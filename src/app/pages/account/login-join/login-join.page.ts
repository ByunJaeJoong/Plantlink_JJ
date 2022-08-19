import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import * as firebase from 'firebase';
import { Users } from 'src/app/models/users.model';
import { LoadingService } from 'src/app/services/loading.service';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login-join',
  templateUrl: './login-join.page.html',
  styleUrls: ['./login-join.page.scss'],
})
export class LoginJoinPage implements OnInit {
  user: Users = {
    uid: '',
    dateCreated: new Date().toISOString(),
    name: '',
    address: '',
    email: '',
    phone: '',
    loginType: '',
    exitSwitch: false,
    chatEnterSwitch: false,
    connectSwitch: false,
    plantSwitch: false,
    profileImage: '',
    bluetooth: [],
    myPlant: [],
  };
  constructor(
    private navController: NavController,
    private loadingService: LoadingService,
    private platform: Platform,
    private google: GooglePlus,
    private db: DbService,
    private auth: AuthService,
    private fireAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  async googleLogin() {
    this.loadingService.load();
    this.user.loginType = 'google';
    let params: any = {
      webClientId: '1017905341794-pq01l3btsdl5k30gth7cdctfh50kh0sf.apps.googleusercontent.com',
      offline: true,
    };

    // android 일 때
    if (this.platform.is('cordova') && this.platform.is('android')) {
      this.google
        .login(params)
        .then((response: any) => {
          console.log('google login response', response);
          const { idToken, accessToken } = response;

          this.user.email = response.email;

          const credential = accessToken
            ? firebase.default.auth.GoogleAuthProvider.credential(idToken, accessToken)
            : firebase.default.auth.GoogleAuthProvider.credential(idToken);

          console.log('credential', credential);

          this.fireAuthSignInWithCredential(credential);
        })
        .catch(err => {
          console.log('google login error', err);
          this.loadingService.hide();
        });
    } // web일 때
    else {
      params = {};
      await this.fireAuth
        .signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
        .then(async (success: any) => {
          console.log('google Success', success);

          const user = success.user;
          const uid = user.uid;
          const email = user.email;
          const isLogin = await this.isLoginOrSignUp(uid);
          if (isLogin) this.loginUser(uid, email);
          else this.registerUser(user, email);
          this.loadingService.hide();
        })
        .catch((err: any) => {
          console.log('google login error', err);
          this.loadingService.hide();
        });
    }
    this.loadingService.hide();
  }
  fireAuthSignInWithCredential(credential) {
    this.loadingService.load();
    firebase.default
      .auth()
      .signInWithCredential(credential)
      .then(async (success: any) => {
        console.log('fireAuthSignInWithCredential success : ', success);
        const user = success.user;
        const uid = user.uid;

        const isLogin = await this.isLoginOrSignUp(uid);
        if (isLogin) this.loginUser(uid);
        else this.registerUser(user);
        this.loadingService.hide();
      })
      .catch(error => {
        console.error('fireAuthSignInWithCredential Error: ', error);
        this.loadingService.hide();
      });
  }

  // sociaLoginLink(credential, tokenId?, type?) {
  //   firebase.default
  //     .auth()
  //     .currentUser.linkWithCredential(credential)
  //     .then(data => {
  //       // switch (type) {

  //       //   case 'google':
  //       //     this.db.updateAt(`users/${data.user.uid}`, {
  //       //       loginType: firebase.default.firestore.FieldValue.arrayUnion('google'),
  //       //       googleToken: tokenId,
  //       //     });
  //       //     break;
  //       // }

  //       //로그인할때 처리하는 것들 담아준다.
  //       var uid = data.user.uid;
  //       localStorage.setItem('userId', uid);
  //       this.loadingService.hide();
  //       ////////////////////////////////////
  //     });
  // }

  // 유저 데이터 가져오는 함수
  getUserData(uid) {
    return this.db.doc$(`users/${uid}`).pipe(first()).toPromise();
  }
  // db에 이미 유저가 있으면 true 없으면 false를 반환하는 함수
  async isLoginOrSignUp(uid) {
    const user = await this.getUserData(uid);
    console.log('user', user);

    return user && user.uid && user.uid == uid && user.dateCreated && user.dateCreated.length > 0 ? true : false;
  }
  // 로그인 함수
  async loginUser(uid: string, email?: string): Promise<void> {
    console.log('login uid : ', uid);

    const userTmp = await this.db.doc$(`users/${uid}`).pipe(first()).toPromise();
    if (userTmp && userTmp.anotherAccountId) uid = userTmp.anotherAccountId;

    localStorage.setItem('userId', uid);

    const uidTmp = await this.auth.uid();
    console.log('uidTmp', uidTmp, 'uid', uid);
    const user: any = await this.getUserData(uidTmp);

    console.log('멤버 타입 : ', user.memberType);

    this.navController.navigateRoot(['/tabs/home']);
    this.loadingService.hide();
  }

  // 회원가입 함수
  async registerUser(user: any, email?: string): Promise<void> {
    console.debug('registerUser');

    localStorage.setItem('email', email);

    const users = [];

    this.user.uid = !users || users.length == 0 ? user.uid : users[0].uid;
    if (!this.user.email) this.user.email = email ? email : '';
    this.user.name = user.displayName;
    this.user.phone = user.phoneNumber;
    if (!this.user.phone) this.user.phone = user.phoneNumber ? user.phoneNumber : '';
    const userData = users && users.length > 0 ? { ...users[0], email: email ? email : '' } : this.user;
    console.log('userData', userData);

    console.log('저장되는 유저 데이터', { ...userData, email: this.user.email });

    this.db.updateAt(`users/${this.user.uid}`, { ...userData, email: this.user.email, name: this.user.name, phone: this.user.phone }).then(() => {
      if (users.length > 0) this.loginUser(user.uid, email);
      else this.navController.navigateRoot(['/tabs/home']);
    });

    this.loadingService.hide();
  }

  //로그인하기
  goLogin() {
    this.navController.navigateForward(['/login']);
  }
}

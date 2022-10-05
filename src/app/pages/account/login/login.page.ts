import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  userInfo: any;
  emailValidate: boolean = true;
  passwordValidate: boolean = true;

  isEmail: boolean = false;
  isPass: boolean = false;

  constructor(
    private navController: NavController,
    private db: DbService,
    private auth: AuthService,
    private alert: AlertService,
    private navc: NavController,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  //아이디찾기
  findId() {
    this.navController.navigateForward(['/find-id']);
  }

  //비밀번호 찾기
  findPw() {
    this.navController.navigateForward(['/find-password']);
  }

  //홈으로
  login() {
    if (!this.email) {
      this.emailValidate = false;
      return;
    } else {
      this.emailValidate = true;
    }
    if (!this.password) {
      this.passwordValidate = false;
      return;
    } else {
      this.passwordValidate = true;
    }
    this.loadingService.load();
    this.auth
      .loginUser(this.email, this.password)
      .then(result => {
        localStorage.setItem('userId', result.user.uid);
        this.navc.navigateRoot('/tabs/home');
        this.loadingService.hide();
      })
      .catch(err => {
        if (err.code == 'auth/user-not-found') {
          this.alert.okBtn('alert', '가입되지 않은 이메일입니다.');
        } else if (err.code == 'auth/wrong-password') {
          this.alert.okBtn('alert', '비밀번호를 다시 한번 확인해주세요.');
        } else {
          this.alert.showErrorMessage(err.code);
        }
      });
  }

  changeEmail() {
    let regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

    if (regExp.test(this.email) === true) {
      // 이메일
      this.isEmail = true;
    } else {
      // 이메일이 아님
      this.isEmail = false;
    }
  }

  changePass() {
    let regExp = /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()+|=])[a-zA-Z\d~!@#$%^&*()+|=]{6,12}$/;

    if (regExp.test(this.password) === true) {
      this.isPass = true;
    } else {
      this.isPass = false;
    }
  }

  //회원가입으로
  goJoin() {
    this.navController.navigateForward(['/join']);
  }
}

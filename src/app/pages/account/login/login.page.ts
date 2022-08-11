import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { FindIdPage } from '../find-id/find-id.page';

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

  constructor(
    private navController: NavController,
    private db: DbService,
    private auth: AuthService,
    private alert: AlertService,
    private navc: NavController
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
    } else {
      this.emailValidate = true;
    }
    if (!this.password) {
      this.passwordValidate = false;
    } else {
      this.passwordValidate = true;
    }
    this.auth
      .loginUser(this.email, this.password)
      .then(result => {
        localStorage.setItem('userId', result.user.uid);
        this.navc.navigateRoot('/tabs/home').then(() => {
          this.alert.okBtn('', '로그인에 성공하였습니다.');
        });
      })
      .catch(err => {
        if (err.code == 'auth/user-not-found') {
          this.alert.okBtn('', '가입되지 않은 이메일입니다.');
        } else if (err.code == 'auth/wrong-password') {
          this.alert.okBtn('', '비밀번호를 다시 한번 확인해주세요.');
        } else {
          this.alert.showErrorMessage(err.code);
        }
      });
  }

  //회원가입으로
  goJoin() {
    this.navController.navigateForward(['/join']);
  }
}

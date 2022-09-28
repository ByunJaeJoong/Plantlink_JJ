import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-exit',
  templateUrl: './exit.page.html',
  styleUrls: ['./exit.page.scss'],
})
export class ExitPage implements OnInit {
  userId: string = localStorage.getItem('userId');
  email: string = '';
  password: string = '';

  // 구글로만 로그인이 되어있다면 true로 변경
  loginTypeCheck: boolean = false;

  loginType: any;

  constructor(
    private loading: LoadingService,
    private db: DbService,
    private auth: AuthService,
    private alert: AlertService,
    private navc: NavController
  ) {
    this.getData();
  }

  ngOnInit() {}

  async getData() {
    const user = await this.db.doc$(`users/${this.userId}`).pipe(first()).toPromise();
    this.loginType = user.loginType;

    if (this.loginType.indexOf('email') > -1) {
      this.loginTypeCheck = false;
    } else {
      this.loginTypeCheck = true;
    }

    this.email = user.email;
  }

  //회원탈퇴 진행하기
  goDelete() {
    if (this.loginType.indexOf('email') > -1) {
      this.alert.cancelOkBtn('two-btn', '회원탈퇴를 진행합니다.', '', '취소').then(ok => {
        if (ok) {
          this.auth
            .loginUser(this.email, this.password)
            .then(data => {
              this.db.updateAt(`users/${this.userId}`, {
                exitSwitch: true,
              });
              this.loading.load();

              this.auth
                .exitUser()
                .then(() => {
                  this.alert.toast('회원탈퇴가 정상적으로 이루어졌습니다.').then(() => {
                    this.navc.navigateBack(['/login-join']);
                    this.loading.hide();
                  });
                })
                .catch(err => {
                  console.log(err);
                  this.loading.hide();
                });
            })
            .catch(error => {
              console.log(error);
              this.ErrorAlert();
            });
        }
      });
    } else {
      this.alert.cancelOkBtn('two-btn', '회원탈퇴를 진행합니다.', '', '취소').then(ok => {
        if (ok) {
          this.db.updateAt(`users/${this.userId}`, {
            exitSwitch: true,
          });

          this.auth
            .exitUser()
            .then(() => {
              this.alert.toast('회원탈퇴가 정상적으로 이루어졌습니다.').then(() => {
                this.navc.navigateBack(['/login-join']);
                this.loading.hide();
              });
            })
            .catch(err => {
              console.log(err);
              this.loading.hide();
            });
        }
      });
    }
  }

  //비밀번호 틀린경우
  ErrorAlert() {
    this.alert.okBtn('alert', '비밀번호가 틀립니다.<br>확인 후 다시 입력해주세요.', '');
  }

  //세팅으로
  goSetting() {
    this.navc.navigateBack(['/setting']);
  }
}

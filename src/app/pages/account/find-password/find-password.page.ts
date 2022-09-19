import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PhoneAuthService } from 'src/app/services/phone-auth.service';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-find-password',
  templateUrl: './find-password.page.html',
  styleUrls: ['./find-password.page.scss'],
})
export class FindPasswordPage implements OnInit {
  name: string;
  phone: string;
  user: any;
  email: any;

  userSwitch: boolean = false;
  nameValidate: boolean = false;
  phoneValidate: boolean = false;

  certifyNum: string = '';
  timerStr: string = '03:00';
  Checkbutton: boolean = false;
  certifiedSwitch: boolean = false;
  verificationId: string = '';
  failAuth: boolean = false;
  sendSwitch: boolean = false;

  isEmail: boolean = true;
  isPhone: boolean = true;
  verifyNum: boolean = true;

  constructor(
    private navController: NavController,
    private db: DbService,
    private auth: AuthService,
    private alert: AlertService,
    private loadingService: LoadingService,
    private pa: PhoneAuthService,
    private timer: TimerService,
    private route: ActivatedRoute
  ) {
    this.email = this.route.snapshot.queryParams.email;
  }

  ngOnInit() {}

  // 비밀번호 찾기 일 때 회원정보 확인
  async userCheck() {
    this.user = await this.db
      .collection$(`users`, ref => ref.where('email', '==', this.email).where('phone', '==', this.phone))
      .pipe(first())
      .toPromise();
    if (this.user.length > 0) {
      this.userSwitch = true;
    } else {
      this.userSwitch = false;
    }
    console.log(this.user);
  }

  changePhone() {
    if (!this.phone) {
      this.isPhone = true;
      return;
    }
    let regExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    console.log(regExp.test(this.phone));
    if (regExp.test(this.phone)) {
      this.isPhone = true;
    } else {
      this.isPhone = false;
    }
  }
  changeEmail() {
    if (!this.email) {
      this.isEmail = true;
      return;
    }
    let regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

    if (regExp.test(this.email) === true) {
      // 이메일
      this.isEmail = true;
    } else {
      // 이메일이 아님
      this.isEmail = false;
    }
  }
  changeNum() {
    if (!this.certifyNum) {
      this.verifyNum = true;
      return;
    }
    let regExp = /^([0-9]{6})$/g;
    if (regExp.test(this.certifyNum)) {
      this.verifyNum = true;
    } else {
      this.verifyNum = false;
    }
  }

  // 회원정보 확인 후 인증번호 발송
  async authenticate() {
    await this.loadingService.load();
    await this.userCheck();

    if (!this.userSwitch) {
      this.alert.okBtn('alert', '일치하는 회원 정보가 없습니다.');
      return;
    }
    if (this.sendSwitch) {
      this.timeOverAlert();
    } else {
      this.timer.stop();
      try {
        const verificationId: string = await this.pa.authentication('+82' + Number(this.phone));
        this.verificationId = verificationId;
        this.sendSwitch = true;
        this.prove();
        this.timerStart();
        console.log('send');
      } catch (error) {
        if (error.code == 'auth/invalid-verification-code') {
          this.wrongNumber();
        }
        console.log(error);
      }
    }
    await this.loadingService.hide();
  }
  prove() {
    this.alert.toast('인증번호를 발송했습니다.', 'toast-style', 2000);
  }
  wrongNumber() {
    if (this.verifyNum == true) {
      this.verifyNum = false;
    }
    // this.alert.okBtn('alert', `인증번호 확인 후<br>다시 인증번호를 입력해주세요.`);
  }

  // 인증번호 유효시간
  async timerStart(): Promise<void> {
    this.timer
      .countdown(3)
      .pipe()
      .subscribe(next => {
        this.timerStr = next.display;
        if (next.complete == 1) {
          this.timeOverAlert();
        }
      });
    setTimeout(() => {
      this.sendSwitch = false;
    }, 180000);
  }

  timeOverAlert() {
    this.alert.okBtn('alert', `${this.timerStr} 뒤에 재요청이 가능합니다.`);
  }

  // 인증번호 일치하는지 확인
  async complete(): Promise<void> {
    this.loadingService.load();

    this.pa
      .complete(this.verificationId, String(this.certifyNum))
      .then(async () => {
        this.completeProcess();
        this.loadingService.hide();
        this.auth.sendPasswordReset(this.email);
        this.navController.navigateRoot(['/login']);
      })
      .catch(error => {
        this.completeErrorProcess(error);
        this.loadingService.hide();
      });
  }
  completeProcess(): void {
    this.certifiedSwitch = true;
    this.timer.stop();
  }
  completeErrorProcess(error: any): void {
    if (error && error.code == 'auth/code-expired') {
      this.timeOverAlert();
    } else if (error.code == 'auth/invalid-verification-code') {
      this.failAuth = true;
      this.wrongNumber();
    } else {
      this.alert.okBtn('alert', '다시 한번 시도해 주세요.');
    }
  }

  //x버튼 누르면 로그인화면으로
  back() {
    this.navController.navigateBack(['/login']);
  }
}

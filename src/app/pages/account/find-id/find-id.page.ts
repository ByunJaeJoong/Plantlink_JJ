import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { DbService } from 'src/app/services/db.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PhoneAuthService } from 'src/app/services/phone-auth.service';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-find-id',
  templateUrl: './find-id.page.html',
  styleUrls: ['./find-id.page.scss'],
})
export class FindIdPage implements OnInit {
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

  isName: boolean = true;
  isPhone: boolean = true;
  verifyNum: boolean = true;

  constructor(
    private navController: NavController,
    private db: DbService,
    private alert: AlertService,
    private loadingService: LoadingService,
    private pa: PhoneAuthService,
    private timer: TimerService
  ) {}

  ngOnInit() {}

  // 아이디 찾기 일 때 회원정보 확인
  async userCheck() {
    this.user = await this.db
      .collection$(`users`, ref => ref.where('name', '==', this.name).where('phone', '==', this.phone))
      .pipe(first())
      .toPromise();
    if (this.user.length > 0) {
      this.userSwitch = true;
    } else {
      this.userSwitch = false;
    }
  }

  // 전화번호 입력 시, validation 정규식
  changePhone() {
    if (!this.phone) {
      this.isPhone = true;
      return;
    }
    let regExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (regExp.test(this.phone)) {
      this.isPhone = true;
    } else {
      this.isPhone = false;
    }
  }

  // 이름 입력 시, validation 정규식
  changeName() {
    if (!this.name) {
      this.isName = true;
      return;
    }
    let regExp = /([^가-힣\x20])/i;
    if (regExp.test(this.name)) {
      this.isName = false;
    } else {
      this.isName = true;
    }
  }

  // 인증번로 입력 시, validation 정규식
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
      } catch (error) {
        if (error.code == 'auth/invalid-verification-code') {
          this.wrongNumber();
        }
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
        this.navController.navigateForward(['/find-id-confirm'], {
          queryParams: {
            email: this.user[0].email,
          },
        });
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

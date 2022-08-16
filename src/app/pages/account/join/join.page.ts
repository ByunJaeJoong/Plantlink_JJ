import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { Users } from 'src/app/models/users.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MoveParamsService } from 'src/app/services/move-params.service';
import { PhoneAuthService } from 'src/app/services/phone-auth.service';
import { TimerService } from 'src/app/services/timer.service';
import { postcode } from 'src/assets/js/postcode.js';

@Component({
  selector: 'app-join',
  templateUrl: './join.page.html',
  styleUrls: ['./join.page.scss'],
})
export class JoinPage implements OnInit {
  @ViewChild('address_pop', { read: ElementRef, static: true }) popup!: ElementRef;

  users: Users = {
    uid: '',
    dateCreated: new Date().toISOString(),
    exitSwitch: false,
    name: '',
    address: '',
    email: '',
    phone: '',
    loginType: 'email',
    chatEnterSwitch: false,
    connectSwitch: false,
    plantSwitch: false,
    profileImage: '',
    bluetooth: [],
    myPlant: [],
  };

  store = {
    address: '',
  };

  address: string;
  address2: string;
  password: string;
  confirmPassword: string;
  certifyNum: string;
  timerStr: string = '03:00';
  verificationId: string;

  emailOverlap: boolean = false;
  sendSwitch: boolean = false;
  certifiedSwitch: boolean = false;
  failAuth: boolean = false;

  agree: boolean;
  search: string = '';
  shopAddress: any;
  shopZoneCode: any;
  shopAddressSwitch: boolean = false;

  constructor(
    private navController: NavController,
    private alert: AlertService,
    private auth: AuthService,
    private db: DbService,
    private pa: PhoneAuthService,
    private loading: LoadingService,
    private timer: TimerService,
    private renderer: Renderer2,
    private moveParamsService: MoveParamsService
  ) {}

  ngOnInit() {
    const param = this.moveParamsService.getData();
  }

  // 아이디 유효성 검사
  async checkEmail() {
    const userInfo = await this.db
      .collection$(`users`, ref => ref.where('email', '==', this.users.email))
      .pipe(first())
      .toPromise();
    if (userInfo?.length > 0) {
      this.alert.okBtn('alert', '이미 사용중인 아이디 입니다.');
      this.emailOverlap = false;
    } else {
      this.alert.okBtn('alert', '사용할 수 있는 아이디 입니다.', '');
      this.emailOverlap = true;
    }
  }
  emailExpression() {
    let regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    return regExp.test(this.users.email);
  }
  emailChange() {
    if (this.emailOverlap) {
      this.emailOverlap = false;
    }
  }

  // 비밀번호 유효성 검사
  passwordExpression() {
    let reg = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,12}$/;
    return reg.test(this.password);
  }
  passwordCheck() {
    if (this.password != this.confirmPassword) {
      return false;
    } else {
      return true;
    }
  }

  // 휴대폰 인증
  async authenticate() {
    await this.loading.load();
    this.timer.stop();
    try {
      const verificationId: string = await this.pa.authentication('+82' + Number(this.users.phone));
      this.verificationId = verificationId;
      this.sendSwitch = true;
      this.alert.okBtn('alert', '인증번호가 발송되었습니다.');
      this.timerStart();
      console.log('send');
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        this.wrongNumber();
      }
      console.log(error);
    }
    await this.loading.hide();
  }
  wrongNumber() {
    this.alert.okBtn('alert', `인증번호 확인 후<br>다시 인증번호를 입력해주세요.`);
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
  }
  timeOverAlert() {
    this.alert.okBtn('alert', `${this.timerStr} 뒤에 재요청이 가능합니다.`);
  }

  // 인증번호 일치하는지 확인
  async checkedNumber(): Promise<void> {
    this.loading.load();

    this.pa
      .complete(this.verificationId, String(this.certifyNum))
      .then(async () => {
        this.completeProcess();
        this.loading.hide();
        this.alert.okBtn('alert', '인증번호가 확인되었습니다.');
      })
      .catch(error => {
        this.completeErrorProcess(error);
        this.loading.hide();
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
  phoneChange() {
    if (this.certifiedSwitch) {
      this.certifiedSwitch = false;
    }
  }

  // 주소
  openDaumPopup() {
    setTimeout(() => {
      this.getAddress().then(data => {
        this.shopZoneCode = data.sigunguCode;
        this.shopAddress = data.roadAddress;
        console.log('data', data);
        this.shopAddressSwitch = true;
        this.address = data.address;
        this.search = data.sido + '/' + data.sigungu + '/' + data.bname;
      });

      // postcode(this.renderer, this.popup.nativeElement, data => {
      //   console.log(data);
      //   this.store.address = data.address;
      // });
    }, 1000);
  }

  getAddress(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      postcode(this.renderer, this.popup.nativeElement, data => {
        resolve(data);
      });
    });
  }

  closeDaumPopup() {
    this.renderer.setStyle(this.popup.nativeElement, 'display', 'none');
  }

  //회원가입 완료 화면으로
  goCom() {
    if (!this.emailOverlap) {
      this.alert.okBtn('alert', '아이디 중복검사를 진행해 주세요.');
      return;
    }
    if (!this.passwordCheck) {
      this.alert.okBtn('alert', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!this.certifiedSwitch) {
      this.alert.okBtn('alert', '휴대폰 인증을 진행해 주세요.');
      return;
    }
    if (!this.agree) {
      this.alert.okBtn('alert', '개인 정보 이용에 동의해 주세요.');
      return;
    }
    if (this.emailOverlap && this.passwordCheck && this.certifiedSwitch && this.agree) {
      this.auth.registerUser(this.users.email, this.confirmPassword).then(result => {
        this.users.uid = result.user.uid;
        this.users.address = `${this.address} ${this.address2}`;
        this.db.updateAt(`users/${result.user.uid}`, this.users).then(() => {
          console.log('성공!');
          this.loading.hide();
          this.navController.navigateForward(['/complete-join']);
        });
      });
    }
  }

  // 닫기
  closeAddressPopup() {
    this.renderer.setStyle(this.popup.nativeElement, 'display', 'none');
  }
  //나머지 주소 입력하기
  addAddress() {
    this.moveParamsService.setData(this.users);
    this.navController.navigateForward(['/join-address']);
  }
}

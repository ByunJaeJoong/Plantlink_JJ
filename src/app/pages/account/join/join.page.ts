import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.page.html',
  styleUrls: ['./join.page.scss'],
})
export class JoinPage implements OnInit {
  constructor(private navController: NavController, private alertService: AlertService) {}

  ngOnInit() {}

  //아이디중복확인 1.사용가능
  checkIdOk() {
    this.alertService.okBtn('alert', '사용할 수 있는 아이디 입니다.', '');
  }

  //아이디중복확인 1.사용불가능
  checkIdNo() {
    this.alertService.okBtn('alert', '사용할 수 없는 아이디 입니다.', '');
  }

  //이메일중복확인 1.사용가능
  checkEmailOk() {
    this.alertService.okBtn('alert', '사용할 수 있는 이메일 입니다.', '');
  }

  //아이디중복확인 1.사용불가능
  checkEmailNo() {
    this.alertService.okBtn('alert', '사용할 수 없는 이메일 입니다.', '');
  }

  //인증번호발송
  checkNumber() {
    this.alertService.okBtn('alert', '인증번호가 발송되었습니다.', '');
  }

  //인증번호 확인
  checkedNumber() {
    this.alertService.okBtn('alert', '인증번호가 확인되었습니다.', '');
  }

  //회원가입 완료 화면으로
  goCom() {
    this.navController.navigateForward(['/complete-join']);
  }

  //나머지 주소 입력하기
  addAddress() {
    this.navController.navigateForward(['/join-address']);
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-find-password',
  templateUrl: './find-password.page.html',
  styleUrls: ['./find-password.page.scss'],
})
export class FindPasswordPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //x버튼 누르면 로그인화면으로
  back() {
    this.navController.navigateBack(['/login']);
  }

  //비밀번호확인 페이지로
  goPassConfirm() {
    this.navController.navigateForward(['/find-pass-confirm']);
  }
}

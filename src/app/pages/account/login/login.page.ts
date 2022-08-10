import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private navController: NavController) {}

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
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  //회원가입으로
  goJoin() {
    this.navController.navigateForward(['/join']);
  }
}

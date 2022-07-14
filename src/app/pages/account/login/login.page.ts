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

  //비번찾기
  findPw() {
    this.navController.navigateForward(['/find-password']);
  }
}

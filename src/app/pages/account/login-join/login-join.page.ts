import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login-join',
  templateUrl: './login-join.page.html',
  styleUrls: ['./login-join.page.scss'],
})
export class LoginJoinPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //로그인하기
  goLogin() {
    this.navController.navigateForward(['/login']);
  }
}

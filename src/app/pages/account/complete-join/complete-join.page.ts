import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-complete-join',
  templateUrl: './complete-join.page.html',
  styleUrls: ['./complete-join.page.scss'],
})
export class CompleteJoinPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //로그인화면으로
  goLogin() {
    this.navController.navigateForward(['/login']);
  }
}

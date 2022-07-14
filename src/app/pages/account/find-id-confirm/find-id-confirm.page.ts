import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-find-id-confirm',
  templateUrl: './find-id-confirm.page.html',
  styleUrls: ['./find-id-confirm.page.scss'],
})
export class FindIdConfirmPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //아이디찾기
  goLoign() {
    this.navController.navigateForward(['/login']);
  }

  //비번찾기
  findPw() {
    this.navController.navigateForward(['/find-password']);
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-find-id',
  templateUrl: './find-id.page.html',
  styleUrls: ['./find-id.page.scss'],
})
export class FindIdPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //x버튼 누르면 로그인화면으로
  back() {
    this.navController.navigateBack(['/login']);
  }

  //아이디확인 페이지로
  goIdConfirm() {
    this.navController.navigateForward(['/find-id-confirm']);
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-find-pass-confirm',
  templateUrl: './find-pass-confirm.page.html',
  styleUrls: ['./find-pass-confirm.page.scss'],
})
export class FindPassConfirmPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //로그인화면으로
  goLoign() {
    this.navController.navigateForward(['/login']);
  }
}

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

  //아이디찾기
  goLoign() {
    this.navController.navigateForward(['/login']);
  }
}

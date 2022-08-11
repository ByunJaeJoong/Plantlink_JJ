import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FindIdPage } from '../find-id/find-id.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private navController: NavController, private modalCtrl: ModalController) {}

  ngOnInit() {}

  //아이디찾기
  findId() {
    // const modal = await this.modalCtrl.create({
    //   component: FindIdPage,
    //   componentProps: {
    //     type: 'id',
    //   },
    // });
    // await modal.present();
    this.navController.navigateForward(['/find-id'], {
      queryParams: {
        type: 'id',
      },
    });
  }

  //비밀번호 찾기
  findPw() {
    this.navController.navigateForward(['/find-id'], {
      queryParams: {
        type: 'password',
      },
    });
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

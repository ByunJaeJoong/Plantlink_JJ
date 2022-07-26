import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-fake-tab-off',
  templateUrl: './fake-tab-off.component.html',
  styleUrls: ['./fake-tab-off.component.scss'],
})
export class FakeTabOffComponent implements OnInit {
  constructor(private navController: NavController, public menuController: MenuController) {}

  ngOnInit() {}

  //홈으로 이동
  goHome() {
    this.navController.navigateRoot(['/tabs/home']);
  }

  //대화로 이동
  goChatting() {
    this.navController.navigateRoot(['/tabs/chatting']);
  }

  //식물로 이동
  goPlant() {
    this.navController.navigateRoot(['/tabs/plant']);
  }

  // 메뉴
  openAppMenu() {
    this.menuController.open('first');
  }
}

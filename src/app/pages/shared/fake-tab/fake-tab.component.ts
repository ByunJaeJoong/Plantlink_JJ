import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-fake-tab',
  templateUrl: './fake-tab.component.html',
  styleUrls: ['./fake-tab.component.scss'],
})
export class FakeTabComponent implements OnInit {
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

  // 메뉴
  openAppMenu() {
    this.menuController.open('first');
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fake-tab-off',
  templateUrl: './fake-tab-off.component.html',
  styleUrls: ['./fake-tab-off.component.scss'],
})
export class FakeTabOffComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //홈으로 이동
  goHome() {
    this.navController.navigateRoot(['/tabs/home']);
  }

  //대화로 이동
  goChatting() {
    this.navController.navigateRoot(['/tabs/chatting']);
  }
}

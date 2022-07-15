import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-chatting-detail',
  templateUrl: './chatting-detail.page.html',
  styleUrls: ['./chatting-detail.page.scss'],
})
export class ChattingDetailPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  headerBackSwitch = false;

  //헤더 스크롤 할 때 색 변하게
  logScrolling(event) {
    let scroll = event.detail.scrollTop;
    console.log(event);

    if (scroll > 56) {
      this.headerBackSwitch = true;
    } else {
      this.headerBackSwitch = false;
    }
  }

  //대화리스트로
  goChatList() {
    this.navController.navigateBack(['/tabs/chat']);
  }
}

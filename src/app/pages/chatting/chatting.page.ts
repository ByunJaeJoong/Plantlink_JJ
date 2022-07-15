import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.page.html',
  styleUrls: ['./chatting.page.scss'],
})
export class ChattingPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //홈으로
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }
}

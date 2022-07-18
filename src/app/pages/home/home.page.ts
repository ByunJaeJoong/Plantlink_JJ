import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(public menuController: MenuController) {}

  ngOnInit() {}

  // 메뉴
  openAppMenu() {
    this.menuController.open('first');
  }
}

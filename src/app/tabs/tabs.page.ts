import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(public menuController: MenuController) {}

  // 메뉴
  openAppMenu() {
    this.menuController.enable(true, 'first');
    this.menuController.open('first');
  }
}

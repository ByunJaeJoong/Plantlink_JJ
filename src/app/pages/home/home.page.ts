import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(public menuController: MenuController, private db: DbService) {}

  ngOnInit() {}

  // 메뉴
  openAppMenu() {
    this.menuController.open('first');
  }
}

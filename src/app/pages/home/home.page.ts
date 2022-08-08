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

  ngOnInit() {
    // this.update();
  }

  // update() {
  //   const id = this.db.createId();
  //   this.db.updateAt(faq/${id}, {
  //     faqId: id,
  //     title: 'title',
  //     content: 'content',
  //     dateCreated: new Date().toISOString(),
  //     userType: 'business',
  //     deleteSwitch: false,
  //   });
  // }

  // 메뉴
  openAppMenu() {
    this.menuController.open('first');
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-connect-device',
  templateUrl: './connect-device.page.html',
  styleUrls: ['./connect-device.page.scss'],
})
export class ConnectDevicePage implements OnInit {
  userId: any;
  constructor(private navController: NavController, private db: DbService) {}

  ngOnInit() {}

  //홈화면으로 가기
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  //장치찾기로
  findDevice() {
    this.navController.navigateForward(['/find-device']);
  }
}

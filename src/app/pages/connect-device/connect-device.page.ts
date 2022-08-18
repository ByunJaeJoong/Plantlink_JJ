import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-connect-device',
  templateUrl: './connect-device.page.html',
  styleUrls: ['./connect-device.page.scss'],
})
export class ConnectDevicePage implements OnInit {
  deviceList: any = [];

  constructor(private navController: NavController, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(data => {
      for (let ob in data) {
        this.deviceList.push(JSON.parse(data[ob]));
      }
    });
  }

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

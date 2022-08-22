import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-connect-device',
  templateUrl: './connect-device.page.html',
  styleUrls: ['./connect-device.page.scss'],
})
export class ConnectDevicePage implements OnInit {
  deviceData: any;
  deviceName: string = localStorage.getItem('deviceName');

  constructor(private navController: NavController, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.deviceData = params;
      this.getData();
    });
  }

  ngOnInit() {}

  getData() {
    localStorage.setItem('deviceName', this.deviceData.name);
  }

  //홈화면으로 가기
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }

  //장치찾기로
  findDevice() {
    this.navController.navigateForward(['/find-device']);
  }
}

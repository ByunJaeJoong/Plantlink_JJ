import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-connect-device',
  templateUrl: './connect-device.page.html',
  styleUrls: ['./connect-device.page.scss'],
})
export class ConnectDevicePage implements OnInit {
  deviceList: any = [];
  isConnect: boolean = false;

  constructor(private navController: NavController, private route: ActivatedRoute, private bluetoothSerial: BluetoothSerial, private ble: BLE) {
    this.route.queryParams.subscribe(data => {
      for (let ob in data) {
        this.deviceList.push(JSON.parse(data[ob]));
      }
    });
  }

  ngOnInit() {}

  connect(id: string) {
    try {
      this.ble.connect(id).subscribe(data => {
        this.read(data);
        this.isConnect = true;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async read(data: any) {
    try {
      console.log(data);

      // const arduinoData = await this.ble.read(id, );
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  //홈화면으로 가기
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  //장치찾기로
  findDevice() {
    this.navController.navigateForward(['/find-device']);
  }
}

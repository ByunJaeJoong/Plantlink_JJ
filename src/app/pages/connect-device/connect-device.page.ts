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
  arduinoData: any = [];

  constructor(private navController: NavController, private route: ActivatedRoute, private bluetoothSerial: BluetoothSerial, private ble: BLE) {
    this.route.queryParams.subscribe(data => {
      for (let ob in data) {
        this.deviceList.push(JSON.parse(data[ob]));
      }
    });
  }

  ngOnInit() {}

  // 블루투스 장치를 클릭하여 그 장치와 연결시킴
  connect(id: string) {
    try {
      this.ble.connect(id).subscribe(data => {
        // 연결시킨 장치 안에 데이터를 보냄
        this.read(data);
        // 연결됨을 표시하기 위한 불리언 값
        this.isConnect = true;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async read(data: any) {
    try {
      console.log('클릭한 device data', data);
      // 연결된 장치 고유 아이디
      const deviceId = data.id;
      // 안에서 읽어낼 서비스, 특징 아이디
      const deviceData = data.characteristics;

      deviceData.forEach((device: any) => {
        let serviceId = device.service;
        let characteristicId = device.characteristic;
        let readDevice = device.properties;

        readDevice.forEach(async (data: any) => {
          if (data == 'Read') {
            const readData = await this.ble.read(deviceId, serviceId, characteristicId);
            console.log(readData, String.fromCharCode.apply(null, new Uint8Array(readData)));

            this.arduinoData.push(readData);
          }
        });
      });

      this.bufferData();
    } catch (error) {
      console.log(error);
    }
  }

  bufferData() {
    console.log(this.arduinoData, typeof this.arduinoData);
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

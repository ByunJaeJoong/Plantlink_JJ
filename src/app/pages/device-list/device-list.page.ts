import { Component, OnInit } from '@angular/core';

import { BLE } from '@ionic-native/ble/ngx';
import { NavParams } from '@ionic/angular';

import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  devices: any;
  deviceList: any = [];
  isConnect: boolean = false;
  arduinoData: any = [];

  constructor(private navParams: NavParams, private ble: BLE) {
    this.devices = this.navParams.get('devices');

    for (let ob in this.devices) {
      this.deviceList.push(JSON.parse(this.devices[ob]));
    }
  }

  ngOnInit() {}

  // 깃 수정
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
}

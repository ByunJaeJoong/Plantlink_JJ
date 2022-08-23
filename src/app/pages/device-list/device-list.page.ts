import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  devices: any;
  deviceList: any = [];
  arduinoData: any = [];

  constructor(private ble: BLE, private navController: NavController, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(data => {
      for (let ob in data) {
        this.deviceList.push(JSON.parse(data[ob]));
      }
    });
  }

  ngOnInit() {}

  // 블루투스 장치를 클릭하여 그 장치와 연결시킴
  async connect(id: string) {
    try {
      console.log('클릭한 id', id);
      this.successConnect(id);
    } catch (error) {
      console.log('error', error);
      let code = error.errorMessage;
      let errorId = error.id;

      switch (code) {
        case 'Peripheral Disconnected': {
          this.reconnectDevice(errorId);
          break;
        }
      }
    }
  }

  successConnect(id: string) {
    this.ble.connect(id).subscribe(data => {
      console.log('클릭한 데이터', data);
      // 연결시킨 장치 안에 데이터를 보냄
      this.read(data);

      this.navController.navigateForward(['/connect-device'], {
        queryParams: data,
        skipLocationChange: true,
      });
    });
  }

  reconnectDevice(id: string) {
    this.ble.disconnect(id).then(() => {
      this.successConnect(id);
    });
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
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.navController.navigateBack(['/connect-device']);
  }
}

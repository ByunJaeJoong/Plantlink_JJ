import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  devices: any;
  deviceList: any = [];
  arduinoData: any = [];

  constructor(
    private ble: BLE,
    private navController: NavController,
    private route: ActivatedRoute,
    private alert: AlertService,
    private loading: LoadingService
  ) {
    this.route.queryParams.subscribe(data => {
      for (let ob in data) {
        this.deviceList.push(JSON.parse(data[ob]));
      }
    });
  }

  ngOnInit() {}

  // 블루투스 장치를 클릭하여 그 장치와 연결시킴
  async connect(id: string) {
    this.loading.load('연결 중입니다.');
    this.ble.connect(id).subscribe(
      data => {
        console.log('클릭한 데이터', data);
        // 연결시킨 장치 안에 데이터를 보냄
        this.read(data);

        this.navController.navigateForward(['/connect-device'], {
          queryParams: data,
          skipLocationChange: true,
        });
        this.loading.hide();
      },
      async error => {
        let code = error.errorMessage;
        let errorId = error.id;
        this.loading.hide();
        switch (code) {
          case 'Peripheral Disconnected': {
            const ok = await this.alert.cancelOkBtn('two-btn', `연결 중 오류가 발생했습니다.<br>다시 시도해보겠어요?`, '', '취소', '확인');
            if (ok) {
              this.reconnectDevice(errorId);
            }
            break;
          }
        }
      }
    );
  }

  reconnectDevice(id: string) {
    this.ble.disconnect(id).then(() => {
      this.connect(id);
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
            console.log(this.arduinoData);
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

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
  serviceId: string = '';
  characteristicId: string = '';

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

        this.loading.hide();
      },
      async error => {
        console.log(error);

        this.loading.hide();
        let code = error.errorMessage;
        let errorId = error.id;
        switch (code) {
          case 'Peripheral Disconnected': {
            const ok = await this.alert.cancelOkBtn('two-btn', `연결 중 오류가 발생했습니다.<br>다시 시도해보겠어요?`, '', '취소', '확인');
            if (ok) {
              setTimeout(() => {
                this.reconnectDevice(errorId);
              }, 20000);
            }
            break;
          }
        }
      }
    );
  }

  // 재연결 시도
  reconnectDevice(id: string) {
    this.ble.disconnect(id).then(() => {
      this.connect(id);
    });
  }

  async read(data: any) {
    // 연결된 장치 고유 아이디
    const deviceId = data.id;
    // 안에서 읽어낼 서비스, 특징 아이디
    const deviceData = data.characteristics;

    deviceData.forEach((device: any) => {
      device.properties.forEach((data: any) => {
        if (data == 'WriteWithoutResponse') {
          this.serviceId = device.service;
          this.characteristicId = device.characteristic;
        }
      });
    });

    if (this.serviceId && this.characteristicId) {
      // 센서에 데이터 값이 변동될때 마다 값을 보냄
      this.ble.startNotification(deviceId, this.serviceId, this.characteristicId).subscribe(
        buffer => {
          let uint8Data = new Uint8Array(buffer);
          let ascString = new TextDecoder().decode(uint8Data);
          console.log('asc', ascString, typeof ascString);

          if (ascString != '0\r\n') {
            this.arduinoData.push(ascString);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  async isConnect(id: string) {
    this.ble
      .isConnected(id)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  close() {
    this.navController.navigateBack(['/connect-device']);
  }
}

// read에 대한 데이터
// if (buffer) {
//   console.log('Notification으로 후  읽기로 들어옴');
//   this.ble.read(id, 'FFE0', 'FFE1').then(data => {
//     console.log('readData2', data, String.fromCharCode.apply(null, new Uint8Array(data)));

//     this.ngZone.run(() => {
//       this.arduinoData.push(data);
//     });
//     console.log('arduinoData2', this.arduinoData);
//   });
// }

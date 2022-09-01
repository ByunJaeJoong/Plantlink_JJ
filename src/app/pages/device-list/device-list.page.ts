import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DbService } from 'src/app/services/db.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  userId: string = localStorage.getItem('userId');

  devices: any;
  deviceList: any = [];

  serviceId: string = '';
  characteristicId: string = '';

  isValid: boolean = true;
  myPlant: any;

  bluetoothData: any = [];

  ascString: string = '';
  divisionData: any;
  senserData: any;

  soil: number;
  temperature: number;
  light: number;

  first: Uint8Array;
  last: Uint8Array;

  constructor(
    private db: DbService,
    private ble: BLE,
    private navController: NavController,
    private route: ActivatedRoute,
    private alert: AlertService,
    private loading: LoadingService,
    private ngZone: NgZone
  ) {
    this.route.queryParams.subscribe(data => {
      for (let ob in data) {
        this.deviceList.push(JSON.parse(data[ob]));
      }
      this.getData();
    });
  }

  ngOnInit() {}

  async getData() {
    this.myPlant = await this.db
      .collection$(`myPlant`, ref => ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false).where('cancelSwitch', '==', false))
      .pipe(first())
      .toPromise();
    console.log(this.myPlant);
  }

  // 블루투스 장치를 클릭하여 그 장치와 연결시킴
  async connect(id: string) {
    this.loading.load('연결 중입니다.');
    this.ble.connect(id).subscribe(
      data => {
        console.log('클릭한 데이터', data);
        // 연결시킨 장치 안에 데이터를 보냄
        this.navController.navigateForward(['/connect-device'], {
          queryParams: data,
          skipLocationChange: true,
        });

        this.read(data);
        this.loading.hide();
      },
      async error => {
        this.loading.hide();
        this.peripheralError(error);
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
          //Uint8 -> ASCII
          this.ascString = new TextDecoder().decode(uint8Data);
          console.log(this.ascString);

          let temperature = this.ascString.split(',')[2];
          let check = this.ascString.indexOf(':');

          // 온도가 없으면서 하나만 있는 값이 아닌것을 파악
          if (!temperature && check > -1) {
            this.first = uint8Data;
          }

          // 하나만 있는 값을 파악
          if (check == -1) {
            this.last = uint8Data;
          }

          // 따로 온 값을 합쳐서 사용
          let mergeString = this.mergeUInt8Arrays(this.first, this.last);

          if (temperature) {
            this.onDataDiscovered(this.ascString);
          }
          if (mergeString) {
            this.onDataDiscovered(mergeString);
          }
          this.isValid = false;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  // 센서에 변화되는 데이터 값의 List안에 push하는 함수
  onDataDiscovered(data: string) {
    this.ngZone.run(() => {
      this.bluetoothData.push(data);
    });
    this.remakeData();
  }

  remakeData() {
    console.log(this.bluetoothData);
    this.bluetoothData.forEach((data: any) => {
      this.divisionData = data.split(':');
      this.senserData = this.divisionData[1].split(',');

      console.log(this.divisionData, this.senserData);
      if (this.divisionData[0].includes('Current')) {
        this.soil = this.percent(this.senserData[0]);
        this.light = this.percent(this.senserData[1]);
        this.temperature = this.temperatureCal(this.senserData[2]);
        this.currentData(this.soil, this.light, this.temperature);
      }
    });
  }

  // 퍼센트 계산
  percent(par: string) {
    return (Number(par) / 100) * 100;
  }

  // 플랜트링크 센서 온도 계산
  temperatureCal(temp: string) {
    return Number(temp) / 5;
  }

  // 온도를 못받는 첫번째 센서값을 합치는 함수
  mergeUInt8Arrays(a1: Uint8Array, a2: Uint8Array) {
    if (a1 && a2) {
      let mergeUInt8 = new Uint8Array([...a1, ...a2]);
      return new TextDecoder().decode(mergeUInt8);
    }
  }

  currentData(soil: number, light: number, temperature: number) {
    console.log(soil, light, temperature);

    this.db.updateAt(`myPlant/${this.myPlant[0].myPlantId}`, {
      soil,
      light,
      temperature,
    });
  }

  // 연결 도중 에러가 날 경우 경고창
  async peripheralError(error: any) {
    let code = error.errorMessage;
    let errorId = error.id;

    if (this.isValid) {
      switch (code) {
        case 'Peripheral Disconnected': {
          const ok = await this.alert.cancelOkBtn('two-btn', `연결 중 오류가 발생했습니다.<br>다시 시도해보겠어요?`, '', '취소', '확인');
          if (ok) {
            this.loading.load('연결시도 중입니다.');
            setTimeout(() => {
              this.reconnectDevice(errorId);
            }, 20000);
            this.loading.hide();
          }
          break;
        }
      }
    }
  }

  close() {
    this.navController.navigateBack(['/connect-device']);
  }
}

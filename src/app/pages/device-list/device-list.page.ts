import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DbService } from 'src/app/services/db.service';
import { first } from 'rxjs/operators';
import { plantData } from 'src/app/models/plantData.model';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';

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

  now: string;

  plantData: plantData = {
    plantDataId: '',
    userId: '',
    myPlantId: '',
    bluetoothId: '',
    soil: 0,
    light: 0,
    temperature: 0,
    dateCreated: '',
  };

  constructor(
    private db: DbService,
    private ble: BLE,
    private navController: NavController,
    private route: ActivatedRoute,
    private alert: AlertService,
    private loading: LoadingService,
    private ngZone: NgZone,
    private common: CommonService
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
      .collection$(`myPlant`, (ref: any) =>
        ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false).where('cancelSwitch', '==', false)
      )
      .pipe(first())
      .toPromise();
  }

  // 블루투스 장치를 클릭하여 그 장치와 연결시킴
  async connect(id: string) {
    this.bluetoothData = [];

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
    // 중복적인 데이터 가져옴 중복을 제거하는 것
    const set = new Set(this.bluetoothData);
    this.bluetoothData = [...set];
    console.log(this.bluetoothData);

    this.bluetoothData.forEach((data: any) => {
      this.divisionData = data.split(':');
      this.senserData = this.divisionData[1].split(',');

      // 현재상테에 대한 데이터 값을 계산 후 저장
      if (this.divisionData[0].includes('Current')) {
        this.soil = this.percent(this.senserData[0]);
        this.light = this.percent(this.senserData[1]);
        this.temperature = this.temperatureCal(this.senserData[2]);
        this.currentData(this.soil, this.light, this.temperature);
      }

      // 저장된 값의 평균을 가져오기
      if (this.divisionData[0].includes('Saved')) {
        console.log(this.bluetoothData);
        let saveIdx = this.divisionData[0].split(' ')[2];
        console.log('idx 갯수', this.bluetoothData.length);
        console.log('saveIdx', saveIdx);

        for (let i = this.bluetoothData.length; i > -1; i--) {
          let checkDate = moment().subtract(i, 'hour').format('YYYY-MM-DD hh:mm:ss');
          console.log(i, checkDate);
        }
      }

      const save = [
        'Saved Data 1',
        'Saved Data 2',
        'Saved Data 3',
        'Saved Data 4',
        'Saved Data 5',
        'Saved Data 6',
        'Saved Data 7',
        'Saved Data 8',
        'Saved Data 9',
      ];

      console.log('idx 갯수', save.length);

      for (let i = save.length; i > -1; i--) {
        let checkDate = moment().subtract(i, 'hour').format('YYYY-MM-DD hh:mm:ss');
        console.log(i, checkDate);
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

  // 센서의 현재 측정값 저장
  currentData(soil: number, light: number, temperature: number) {
    this.db.updateAt(`myPlant/${this.myPlant[0].myPlantId}`, {
      soil,
      light,
      temperature,
    });
  }

  // 같은 날의 데이터 평균 구하기
  average(arr: Array<any>) {
    const result = arr.reduce((sum, currValue) => {
      return sum + currValue;
    }, 0);

    const ave = result / arr.length;
    console.log(ave);
    return ave;
  }

  // 저장된 날짜 확인하는 함수
  getDayLabels() {}

  // 센서에 저장된 측정값 db에 저장
  savedData(soil: number, light: number, temperature: number, date: string) {
    this.plantData.plantDataId = this.common.generateFilename();
    this.plantData.userId = this.userId;
    this.plantData.myPlantId = this.myPlant[0].myPlantId;
    this.plantData.soil = soil;
    this.plantData.light = light;
    this.plantData.temperature = temperature;
    this.plantData.dateCreated = date;

    this.db.updateAt(`plantData/${this.plantData.plantDataId}`, this.plantData);
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

import { Component, OnInit } from '@angular/core';
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
import { bluetooth } from 'src/app/models/bluetooth.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  userId: string = localStorage.getItem('userId');

  deviceList: any = [];

  // 디바이스 서비스 id
  serviceId: string = '';
  // 디바이스 특징 id
  characteristicId: string = '';

  isValid: boolean = true;
  isConnect: boolean = true;
  myPlant: any;

  ascString: string = '';
  divisionData: any;
  senserData: any;

  first: Uint8Array;
  last: Uint8Array;

  plantData: plantData = {
    plantDataId: '',
    userId: '',
    myPlantId: '',
    bluetoothId: '',
    soil: 0,
    light: 0,
    temperature: 0,
    dateCreated: '',
    senserDate: '',
  };

  senserTime: number = null;
  senserDate: string = '';

  bluetooth: bluetooth = {
    bluetoothId: '',
    myPlantId: '',
    userId: '',
    dateCreated: '',
    name: '',
    senserId: '',
    connectSwitch: false,
    deleteSwitch: false,
  };
  myBluetooth: any;

  constructor(
    private db: DbService,
    private ble: BLE,
    private navController: NavController,
    private route: ActivatedRoute,
    private alert: AlertService,
    private loading: LoadingService,
    private common: CommonService
  ) {
    // 스캔된 장치 리스트들을 this.deviceLis에 push
    this.route.queryParams.subscribe(data => {
      for (let ob in data) {
        this.deviceList.push(JSON.parse(data[ob]));
      }
      this.getData();
    });
  }

  ngOnInit() {}

  async getData() {
    // 나의 식물에 추가된 식물리스트 정보를 가져옴
    this.myPlant = await this.db
      .collection$(`myPlant`, (ref: any) =>
        ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false).where('cancelSwitch', '==', true).orderBy('dateCreated', 'desc')
      )
      .pipe(first())
      .toPromise();

    // 최신으로 식물과 연결한 블루투스를 가져옴
    this.myBluetooth = await this.db
      .collection$(`bluetooth`, (ref: any) => ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false))
      .pipe(first())
      .toPromise();
  }

  // 블루투스 장치를 클릭하여 그 장치와 연결시킴
  async connect(item: any) {
    // item.name에 SoilModule이 포함되어있다면 true
    if (item.name.includes('SM')) {
      this.loading.lognLoad('연결 중입니다.');

      // 디바이스 id를 넣어 연결을 시도하는 함수
      this.ble.connect(item.id).subscribe(
        data => {
          this.isConnect = false;
          // 최근에 연결된 블루투스가 있다면 장치 제거 후
          if (this.myBluetooth.length > 0) {
            this.db.updateAt(`bluetooth/${this.myBluetooth[0].bluetoothId}`, {
              deleteSwitch: true,
            });

            // 블루투스 장치 추가 연결
            this.bluetoothData(data);
          } else {
            this.bluetoothData(data);
          }

          this.navController.navigateForward(['/connect-device']).then(async () => {
            await this.alert.toast('디바이스에 연결되었습니다.', 'toast-style', 2000);
          });

          this.read(data);

          this.loading.hide();
        },
        async error => {
          if (this.isConnect) {
            setTimeout(() => {
              this.loading.hide();
              this.reconnectDevice(error.id);
            }, 15000);
          }
        }
      );
    } else {
      //item.name에 SoilModule이 포함되어있지 않은 디바이스와 연결을 시도할 경우 경고창
      this.alert.toast('블루투스 연결이 불가능한 장치입니다.', 'toast-style', 2000);
    }
  }

  // 나의 식물에서 디바이스와 연동된 식물을 끊어주기 위한 함수
  myPlantConnect() {
    this.myPlant.forEach(ele => {
      if (ele.bluetoothSwitch) {
        this.db.updateAt(`myPlant/${ele.myPlantId}`, {
          bluetoothSwitch: false,
        });
      }
    });
  }

  // 블루투스 장치 저장
  bluetoothData(data: any) {
    this.myPlantConnect();

    this.bluetooth.bluetoothId = this.common.generateFilename();
    this.bluetooth.userId = this.userId;
    this.bluetooth.myPlantId = this.myPlant[0].myPlantId;
    this.bluetooth.name = data.name;
    this.bluetooth.senserId = data.id;
    this.bluetooth.dateCreated = new Date().toISOString();

    this.db.updateAt(`bluetooth/${this.bluetooth.bluetoothId}`, this.bluetooth);

    // 블루투스와 연결하는 식물의 디바이스와 연결 체크
    if (!this.myPlant[0].bluetoothSwitch) {
      this.db.updateAt(`myPlant/${this.myPlant[0].myPlantId}`, {
        bluetoothSwitch: true,
      });
    }

    this.db.updateAt(`users/${this.userId}`, {
      bluetooth: firebase.default.firestore.FieldValue.arrayUnion(this.bluetooth.bluetoothId),
    });
  }

  // 재연결 시도
  reconnectDevice(id: string) {
    this.ble.disconnect(id).then(() => {
      this.connect(id);
    });
  }

  // 센서안의 데이터를 읽어내기 위한 함수
  async read(data: any) {
    this.loading.lognLoad('데이터 저장 중입니다. ');
    const currentDate: Date = new Date();
    this.senserTime = currentDate.getHours(); // 현재시간
    this.senserDate = this.common.formatDate(currentDate); // 현재날짜

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
          this.loading.hide();
        },
        error => {
          this.loading.hide();
        }
      );
    }
  }

  // 센서에 변화되는 데이터 값의 List안에 push하는 함수
  onDataDiscovered(data: string) {
    this.divisionData = data.split(':');
    this.senserData = this.divisionData[1].split(',');

    // 현재상태에 대한 데이터 값을 계산 후 저장
    if (this.divisionData[0].includes('Current')) {
      const soil = this.percent(this.senserData[0]);
      const light = this.percent(this.senserData[1]);
      const temperature = this.temperatureCal(this.senserData[2]);
      this.saveCurrentData(soil, light, temperature);
    }

    // 저장된 값을 퍼센트와 온도 계산하여 값을 저장
    if (this.divisionData[0].includes('Saved')) {
      if (this.senserTime == -1) {
        this.senserDate = moment(this.senserDate).add(-1, 'day').format('YYYY-MM-DD');
        this.senserTime = 23;
      }

      const soil = this.percent(this.senserData[0]);
      const light = this.percent(this.senserData[1]);
      const temperature = this.temperatureCal(this.senserData[2]);

      this.savedData(soil, light, temperature, this.senserDate);
    }
    this.senserTime--;
  }

  // 센서에 저장된 측정값 db에 저장
  savedData(soil: number, light: number, temperature: number, senserDate: string) {
    // 2. plantData 데이터저장
    this.plantData.plantDataId = this.common.generateFilename();
    this.plantData.userId = this.userId;
    this.plantData.myPlantId = this.myPlant[0].myPlantId;
    this.plantData.soil = soil;
    this.plantData.light = light;
    this.plantData.temperature = temperature;
    this.plantData.dateCreated = new Date().toISOString();
    this.plantData.senserDate = senserDate;

    if (this.myBluetooth.length > 0) {
      this.plantData.bluetoothId = this.myBluetooth[0].bluetoothId;
    } else {
      this.plantData.bluetoothId = this.bluetooth.bluetoothId;
    }

    this.db.updateAt(`plantData/${this.plantData.plantDataId}`, this.plantData);
  }

  // 마지막 현재 데이터 저장!
  saveCurrentData(soil: number, light: number, temperature: number) {
    // 3. data의 마지막 current를 나의식물에 저장!'
    this.db.updateAt(`myPlant/${this.myPlant[0].myPlantId}`, {
      soil,
      light,
      temperature,
    });
  }

  // 퍼센트 계산
  percent(par: string) {
    const percent = (Number(par) / 100) * 100;
    return Math.round(percent);
  }

  // 플랜트링크 센서 온도 계산
  temperatureCal(temp: string) {
    const temper = Number(temp) / 5;
    return Math.round(temper);
  }

  // 온도를 못받는 첫번째 센서값을 합치는 함수
  mergeUInt8Arrays(a1: Uint8Array, a2: Uint8Array) {
    if (a1 && a2) {
      let mergeUInt8 = new Uint8Array([...a1, ...a2]);
      return new TextDecoder().decode(mergeUInt8);
    }
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
            }, 15000);
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

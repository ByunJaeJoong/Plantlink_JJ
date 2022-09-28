import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-find-device',
  templateUrl: './find-device.page.html',
  styleUrls: ['./find-device.page.scss'],
})
export class FindDevicePage implements OnInit {
  deviceList: any = [];
  isValid: boolean = false;

  constructor(
    private navController: NavController,
    private bluetoothSerial: BluetoothSerial,
    public loadingService: LoadingService,
    private alertService: AlertService,
    private ble: BLE,
    private ngZone: NgZone
  ) {
    this.main();
  }

  ngOnInit() {}

  // 처음 또는 새로고침을 할 때
  async main() {
    // 장치를 찾았는지를 확인하는 블리언값
    this.isValid = true;
    // 장치 리스트를 빈배열로 설정
    this.deviceList = [];
    // 현재 연결되어 있는 블루투스의 연결을 해제
    this.bluetoothSerial.disconnect();
    // 블루투스가 활성화 되어 있는지 확인
    this.ble
      .isEnabled()
      .then(() => {
        console.log('블루투스 활성화');
        this.searchDevices();
      })
      .catch(() => {
        this.alertService.okBtn('alert', '블루투스가 켜져있는지 확인해주세요.');
        this.isValid = false;
      });
  }

  // 블루투스 장치 검색
  async searchDevices() {
    console.log('진행확인 장치 검색');

    // 주변 블루투스 스캔을 진행
    this.ble.startScan([]).subscribe(device => {
      if (device.name == 'SoilModule') {
        this.onDeviceDiscovered(device);
      }
    });

    setTimeout(() => {
      this.stopScan();
    }, 30000);
  }

  // 스캔 중지
  stopScan() {
    this.ble.stopScan().then(() => {
      console.log('스캔이 중지되었습니다.');

      if (this.deviceList.length <= 0) {
        this.alertService.okBtn('alert', '발견된 장치가 없습니다.<br>다시 찾기를 시도해주세요.');
      } else {
        this.deviceList = this.deviceList.filter((arr, index, callback) => index === callback.findIndex(ele => ele.id === arr.id));

        const devices = [JSON.stringify(this.deviceList)];

        this.navController.navigateRoot(['/device-list'], {
          queryParams: devices,
          skipLocationChange: true,
        });
      }
    });
  }

  // 스캔된 블루투스 장치들을 List안에 push하는 함수
  onDeviceDiscovered(device: object) {
    // 값이 변화할 때마다 체크하면서 push 진행
    this.ngZone.run(() => {
      this.deviceList.push(device);
    });
    if (this.deviceList.length > 0) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  //홈화면으로 가기
  goHome() {
    this.stopScan();
    this.navController.navigateBack(['/connect-device']);
  }

  // 블루투스 리스트 모달창
  // async imgDetail() {
  //   this.stopScan();
  //   const ok = await this.alertService.cancelOkBtn(
  //     'two-btn',
  //     `${this.deviceList.length}개의 장치가 발견되었습니다:)<br>연결페이지로 이동하시겠어요?`,
  //     '',
  //     '취소',
  //     '확인'
  //   );
  //   if (ok) {
  //     const devices = [JSON.stringify(this.deviceList)];

  //     this.navController.navigateRoot(['/device-list'], {
  //       queryParams: devices,
  //       skipLocationChange: true,
  //     });
  //   }
  // }
}

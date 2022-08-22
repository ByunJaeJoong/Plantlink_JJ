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
  isValid = false;

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
    this.isValid = false;
    // 장치 리스트를 빈배열로 설정
    this.deviceList = [];
    // 블루투스 현재 연결을 끊음
    this.bluetoothSerial.disconnect();

    // 블루투스가 활성화 되어 있는지 확인
    try {
      const isEnabled = await this.bluetoothSerial.isEnabled();
      if (isEnabled) {
        console.log('블루투스 활성화');
        this.searchDevices();
      }
    } catch (error) {
      console.log('블루투스 활성화');
      this.alertService.okBtn('alert', '블루투스가 켜져있는지 확인해주세요.');
    }
  }

  // 블루투스 장치 검색
  async searchDevices() {
    console.log('진행확인 장치 검색');

    // this.bluetoothSerial.discoverUnpaired().then(data => {
    //   this.devices = data;
    //   console.log('discoverUnpaired', data);
    //   data.forEach(e => {
    //     console.log('id:', e.id);
    //     this.bluetoothSerial.connect(e.id).subscribe(data => {
    //       console.log('connect', data);
    //     });
    //     // const decoder = new TextDecoder('utf-8');
    //     // this.bluetoothSerial.disconnect();

    //     // this.bluetoothSerial.connect(e.id).subscribe(() => {
    //     //   console.log('connected to:', e.id);
    //     //   this.bluetoothSerial.subscribeRawData().subscribe(data => console.log(decoder.decode(data)));
    //     // });
    //   });
    // });
    // if (this.devices?.length > 0) {
    //   this.isValid = true;
    // } else {
    //   this.isValid = false;
    // }

    // 1초 동안 주변 블루투스 스캔
    this.ble.scan([], 1).subscribe(device => this.onDeviceDiscovered(device));
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
    this.navController.navigateBack(['/connect-device']);
  }

  // 블루투스 리스트 모달창
  async imgDetail() {
    const ok = await this.alertService.cancelOkBtn(
      'two-btn',
      `${this.deviceList.length}개의 장치가 발견되었습니다:)<br>연결페이지로 이동하시겠어요?`,
      '',
      '취소',
      '확인'
    );
    if (ok) {
      const devices = [JSON.stringify(this.deviceList)];

      this.navController.navigateRoot(['/device-list'], {
        queryParams: devices,
        skipLocationChange: true,
      });
    }
  }
}

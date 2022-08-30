import { Component, OnInit, NgZone } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
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
  statusMessage: string;

  constructor(
    private navController: NavController,
    public loadingService: LoadingService,
    private alertService: AlertService,
    private ngZone: NgZone,
    private bluetoothle: BluetoothLE
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
    // 블루투스의 초기 상태를 확인(활성화)
    this.bluetoothle.initialize().subscribe(data => {
      console.log(data);
      if (data.status == 'enabled') {
        this.searchDevices();
      } else {
        this.alertService.okBtn('alert', '블루투스가 켜져있는지 확인해주세요.');
      }
    });
  }

  // 블루투스 장치 검색
  async searchDevices() {
    console.log('진행확인 장치 검색');
    let params = {
      services: [],
    };
    // 주변의 기기들을 스캔시작
    this.bluetoothle.startScan(params).subscribe(
      success => {
        console.log('startScan: ' + success);
        for (var key in success) {
          console.log('startScankey: ' + key + ' / ' + success[key]);
        }
        // 블루투스 이름이 있는 장치만 리스트에 보이도록 저장
        if (success.name) {
          this.onDeviceDiscovered(success);
        }
        this.setStatus(success.address);
      },
      error => {
        console.log('error: ' + error);
        for (var key in error) {
          console.log('error: ' + key + ' / ' + error[key]);
        }
      }
    );
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

  // 스캔 중지
  stopScan() {
    this.bluetoothle.stopScan().then(resp => {
      console.log('stopScan: ' + resp);
      this.setStatus(resp.status);
    });
  }

  // 페어링된 bluetooth LE장치 검색
  retrieveConnected() {
    let params = {
      services: [],
    };
    this.bluetoothle.retrieveConnected(params).then(resp => {
      console.log('retrieveConnected: ' + resp);
      this.setStatus('retrieveConnected');
    });
  }

  setStatus(message: string) {
    console.log('message: ' + message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  //홈화면으로 가기
  goHome() {
    this.navController.navigateBack(['/connect-device']);
  }

  // 블루투스 리스트 모달창
  async imgDetail() {
    this.stopScan();
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

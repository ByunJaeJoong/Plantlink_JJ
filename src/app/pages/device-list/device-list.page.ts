import { Component, OnInit, NgZone } from '@angular/core';
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
    private loading: LoadingService,
    private ngZone: NgZone
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
      () => {
        console.log('연결됨으로 들어옴');

        // this.ngZone.run(() => {
        //   this.ble.read(id, 'FFE0', 'FFE1').then(data => {
        //     console.log('readData', data);
        //     this.arduinoData.push(data);
        //     console.log('arduinoData', this.arduinoData);
        //   });
        // });
        this.ble.startNotification(id, 'FFE0', 'FFE1').subscribe(buffer => {
          console.log('제발 작동해라');

          var data = new Uint8Array(buffer);
          console.log('startNotification', JSON.stringify(data));
          if (buffer) {
            this.ble.read(id, 'FFE0', 'FFE1').then(data => {
              console.log('readData', data);

              this.ngZone.run(() => {
                this.arduinoData.push(data);
              });
              console.log('arduinoData', this.arduinoData);
            });
          }
        });
      },
      error => {
        console.log('Peripheral disconnected');
      }
    );
  }

  close() {
    this.navController.navigateBack(['/connect-device']);
  }
}

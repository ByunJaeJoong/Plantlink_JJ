import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
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
  notifyValue: any;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private alert: AlertService,
    private loading: LoadingService,
    private ngZone: NgZone,
    private bluetoothle: BluetoothLE
  ) {
    this.route.queryParams.subscribe(data => {
      for (let ob in data) {
        this.deviceList.push(JSON.parse(data[ob]));
      }
    });
  }

  ngOnInit() {}

  connect(address: string) {
    let params = {
      address: address,
    };
    this.bluetoothle.connect(params).subscribe(
      success => {
        console.log('successConnect: ' + success);
        for (var key in success) {
          console.log('successConnect: ' + key + ' / ' + success[key]);
        }
        if (success.status == 'connected') {
          this.discover(success.address);
        }
      },
      error => {
        console.log('error: ' + error);
      }
    );
  }

  discover(address: string) {
    let params = {
      address: address,
    };
    this.bluetoothle.discover(params).then(resp => {
      console.log('discover: ' + resp);
      for (var key in resp) {
        console.log('discover: ' + key + ' / ' + resp[key]);
      }
      this.subscribe(resp.address);
    });
  }

  subscribe(address: string) {
    let params = {
      address: address,
      service: 'FFE0',
      characteristic: 'FFE1',
    };
    this.bluetoothle.subscribe(params).subscribe(
      success => {
        console.log('subscribe: ' + success);
        for (var key in success) {
          console.log('subscribe: ' + key + ' / ' + success[key]);
        }
        if (success.value) {
          let value = this.bluetoothle.encodedStringToBytes(success.value);
          console.log('value ', value);
        }
      },
      error => {
        console.log('error: ' + error);
      }
    );
  }

  close() {
    this.navController.navigateBack(['/connect-device']);
  }
}

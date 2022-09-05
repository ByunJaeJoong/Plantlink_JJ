import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-connect-device',
  templateUrl: './connect-device.page.html',
  styleUrls: ['./connect-device.page.scss'],
})
export class ConnectDevicePage implements OnInit {
  bluetooth$: Observable<any>;
  constructor(private navController: NavController, private db: DbService) {
    this.getData();
  }

  ngOnInit() {}

  getData() {
    this.bluetooth$ = this.db.collection$(`bluetooth`, (ref: any) => ref.where('deleteSwitch', '==', false));
  }
  //홈화면으로 가기
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }

  //장치찾기로
  findDevice() {
    this.navController.navigateForward(['/find-device']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  //장치연결
  close() {
    this.modalController.dismiss();
  }
}

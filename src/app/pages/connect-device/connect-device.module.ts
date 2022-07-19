import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectDevicePageRoutingModule } from './connect-device-routing.module';

import { ConnectDevicePage } from './connect-device.page';
import { SharedModule } from '../shared/fake-tab/shared.moduls';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ConnectDevicePageRoutingModule, SharedModule],
  declarations: [ConnectDevicePage],
})
export class ConnectDevicePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindDevicePageRoutingModule } from './find-device-routing.module';

import { FindDevicePage } from './find-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindDevicePageRoutingModule
  ],
  declarations: [FindDevicePage]
})
export class FindDevicePageModule {}

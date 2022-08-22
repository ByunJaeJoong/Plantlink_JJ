import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceListPageRoutingModule } from './device-list-routing.module';

import { DeviceListPage } from './device-list.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DeviceListPageRoutingModule],
  declarations: [DeviceListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DeviceListPageModule {}

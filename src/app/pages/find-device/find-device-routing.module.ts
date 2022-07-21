import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindDevicePage } from './find-device.page';

const routes: Routes = [
  {
    path: '',
    component: FindDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindDevicePageRoutingModule {}

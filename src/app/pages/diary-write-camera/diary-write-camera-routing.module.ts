import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiaryWriteCameraPage } from './diary-write-camera.page';

const routes: Routes = [
  {
    path: '',
    component: DiaryWriteCameraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaryWriteCameraPageRoutingModule {}

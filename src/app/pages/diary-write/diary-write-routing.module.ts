import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiaryWritePage } from './diary-write.page';

const routes: Routes = [
  {
    path: '',
    component: DiaryWritePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaryWritePageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiaryDetailPage } from './diary-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DiaryDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaryDetailPageRoutingModule {}

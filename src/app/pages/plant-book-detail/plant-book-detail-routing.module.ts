import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantBookDetailPage } from './plant-book-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PlantBookDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantBookDetailPageRoutingModule {}

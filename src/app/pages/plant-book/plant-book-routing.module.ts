import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantBookPage } from './plant-book.page';

const routes: Routes = [
  {
    path: '',
    component: PlantBookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantBookPageRoutingModule {}

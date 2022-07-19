import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantReportPage } from './plant-report.page';

const routes: Routes = [
  {
    path: '',
    component: PlantReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantReportPageRoutingModule {}

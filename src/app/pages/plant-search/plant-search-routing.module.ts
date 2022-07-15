import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantSearchPage } from './plant-search.page';

const routes: Routes = [
  {
    path: '',
    component: PlantSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantSearchPageRoutingModule {}

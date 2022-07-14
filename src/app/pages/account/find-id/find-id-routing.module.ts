import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindIdPage } from './find-id.page';

const routes: Routes = [
  {
    path: '',
    component: FindIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindIdPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindIdConfirmPage } from './find-id-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: FindIdConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindIdConfirmPageRoutingModule {}

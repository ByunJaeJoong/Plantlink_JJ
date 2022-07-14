import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindPassConfirmPage } from './find-pass-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: FindPassConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindPassConfirmPageRoutingModule {}

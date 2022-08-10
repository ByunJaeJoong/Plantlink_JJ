import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinAddressPage } from './join-address.page';

const routes: Routes = [
  {
    path: '',
    component: JoinAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinAddressPageRoutingModule {}

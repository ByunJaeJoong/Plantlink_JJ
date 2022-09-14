import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { loginContractPage } from './login-contract.page';

const routes: Routes = [
  {
    path: '',
    component: loginContractPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class loginContractPageRoutingModule {}

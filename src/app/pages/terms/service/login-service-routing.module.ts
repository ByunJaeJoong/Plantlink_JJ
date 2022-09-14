import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { loginServicePage } from './login-service.page';

const routes: Routes = [
  {
    path: '',
    component: loginServicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class loginServicePageRoutingModule {}

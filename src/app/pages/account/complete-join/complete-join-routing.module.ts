import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompleteJoinPage } from './complete-join.page';

const routes: Routes = [
  {
    path: '',
    component: CompleteJoinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleteJoinPageRoutingModule {}

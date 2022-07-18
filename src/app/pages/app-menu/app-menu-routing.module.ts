import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppMenuPage } from './app-menu.page';

const routes: Routes = [
  {
    path: '',
    component: AppMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppMenuPageRoutingModule {}

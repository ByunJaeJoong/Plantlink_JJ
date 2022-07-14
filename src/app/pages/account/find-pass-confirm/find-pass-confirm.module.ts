import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindPassConfirmPageRoutingModule } from './find-pass-confirm-routing.module';

import { FindPassConfirmPage } from './find-pass-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindPassConfirmPageRoutingModule
  ],
  declarations: [FindPassConfirmPage]
})
export class FindPassConfirmPageModule {}

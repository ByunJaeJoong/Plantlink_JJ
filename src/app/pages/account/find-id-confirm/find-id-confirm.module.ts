import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindIdConfirmPageRoutingModule } from './find-id-confirm-routing.module';

import { FindIdConfirmPage } from './find-id-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindIdConfirmPageRoutingModule
  ],
  declarations: [FindIdConfirmPage]
})
export class FindIdConfirmPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindIdPageRoutingModule } from './find-id-routing.module';

import { FindIdPage } from './find-id.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindIdPageRoutingModule
  ],
  declarations: [FindIdPage]
})
export class FindIdPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompleteJoinPageRoutingModule } from './complete-join-routing.module';

import { CompleteJoinPage } from './complete-join.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompleteJoinPageRoutingModule
  ],
  declarations: [CompleteJoinPage]
})
export class CompleteJoinPageModule {}

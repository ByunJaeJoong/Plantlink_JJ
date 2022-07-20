import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaryDetailPageRoutingModule } from './diary-detail-routing.module';

import { DiaryDetailPage } from './diary-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiaryDetailPageRoutingModule
  ],
  declarations: [DiaryDetailPage]
})
export class DiaryDetailPageModule {}

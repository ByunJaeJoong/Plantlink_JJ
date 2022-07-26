import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaryDetailPageRoutingModule } from './diary-detail-routing.module';

import { DiaryDetailPage } from './diary-detail.page';
import { SharedModule } from '../shared/fake-tab/shared.moduls';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DiaryDetailPageRoutingModule, SharedModule],
  declarations: [DiaryDetailPage],
})
export class DiaryDetailPageModule {}

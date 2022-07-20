import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaryWritePageRoutingModule } from './diary-write-routing.module';

import { DiaryWritePage } from './diary-write.page';
import { SharedModule } from '../shared/fake-tab/shared.moduls';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DiaryWritePageRoutingModule],
  declarations: [DiaryWritePage],
})
export class DiaryWritePageModule {}

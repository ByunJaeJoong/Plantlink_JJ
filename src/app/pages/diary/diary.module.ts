import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaryPageRoutingModule } from './diary-routing.module';

import { DiaryPage } from './diary.page';
import { MbscModule } from '@mobiscroll/angular';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DiaryPageRoutingModule, MbscModule],
  declarations: [DiaryPage],
})
export class DiaryPageModule {}

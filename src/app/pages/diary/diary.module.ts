import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaryPageRoutingModule } from './diary-routing.module';

import { DiaryPage } from './diary.page';
import { MbscModule } from '@mobiscroll/angular';
import { SharedModule } from '../shared/fake-tab/shared.moduls';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DiaryPageRoutingModule, MbscModule, SharedModule, HttpClientModule, HttpClientJsonpModule],
  declarations: [DiaryPage],
})
export class DiaryPageModule {}

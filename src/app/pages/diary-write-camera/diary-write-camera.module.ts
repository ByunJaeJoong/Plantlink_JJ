import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaryWriteCameraPageRoutingModule } from './diary-write-camera-routing.module';

import { DiaryWriteCameraPage } from './diary-write-camera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiaryWriteCameraPageRoutingModule
  ],
  declarations: [DiaryWriteCameraPage]
})
export class DiaryWriteCameraPageModule {}

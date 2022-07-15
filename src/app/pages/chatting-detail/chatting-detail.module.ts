import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChattingDetailPageRoutingModule } from './chatting-detail-routing.module';

import { ChattingDetailPage } from './chatting-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChattingDetailPageRoutingModule
  ],
  declarations: [ChattingDetailPage]
})
export class ChattingDetailPageModule {}

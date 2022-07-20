import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantBookDetailPageRoutingModule } from './plant-book-detail-routing.module';

import { PlantBookDetailPage } from './plant-book-detail.page';
import { SharedModule } from '../shared/fake-tab/shared.moduls';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlantBookDetailPageRoutingModule, SharedModule],
  declarations: [PlantBookDetailPage],
})
export class PlantBookDetailPageModule {}

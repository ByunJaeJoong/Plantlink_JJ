import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantDetailPageRoutingModule } from './plant-detail-routing.module';

import { PlantDetailPage } from './plant-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantDetailPageRoutingModule
  ],
  declarations: [PlantDetailPage]
})
export class PlantDetailPageModule {}

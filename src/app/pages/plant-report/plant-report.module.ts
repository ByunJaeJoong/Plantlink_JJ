import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantReportPageRoutingModule } from './plant-report-routing.module';

import { PlantReportPage } from './plant-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantReportPageRoutingModule
  ],
  declarations: [PlantReportPage]
})
export class PlantReportPageModule {}

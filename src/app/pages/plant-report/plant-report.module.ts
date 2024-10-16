import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantReportPageRoutingModule } from './plant-report-routing.module';

import { PlantReportPage } from './plant-report.page';
import { SharedModule } from '../shared/fake-tab/shared.moduls';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlantReportPageRoutingModule, SharedModule, MatDialogModule],
  declarations: [PlantReportPage],
})
export class PlantReportPageModule {}

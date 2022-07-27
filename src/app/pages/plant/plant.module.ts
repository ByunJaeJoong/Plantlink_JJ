import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantPageRoutingModule } from './plant-routing.module';

import { PlantPage } from './plant.page';
import { SharedModule } from '../shared/fake-tab/shared.moduls';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlantPageRoutingModule, SharedModule],
  declarations: [PlantPage],
})
export class PlantPageModule {}

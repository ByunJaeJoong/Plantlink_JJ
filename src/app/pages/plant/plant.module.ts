import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantPageRoutingModule } from './plant-routing.module';

import { PlantPage } from './plant.page';
import { SharedModule } from '../shared/fake-tab/shared.moduls';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlantPageRoutingModule, SharedModule, PipesModule],
  declarations: [PlantPage],
})
export class PlantPageModule {}

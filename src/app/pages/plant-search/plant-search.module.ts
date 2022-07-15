import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantSearchPageRoutingModule } from './plant-search-routing.module';

import { PlantSearchPage } from './plant-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantSearchPageRoutingModule
  ],
  declarations: [PlantSearchPage]
})
export class PlantSearchPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantBookPageRoutingModule } from './plant-book-routing.module';

import { PlantBookPage } from './plant-book.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantBookPageRoutingModule
  ],
  declarations: [PlantBookPage]
})
export class PlantBookPageModule {}

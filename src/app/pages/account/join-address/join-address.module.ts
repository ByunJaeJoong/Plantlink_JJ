import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinAddressPageRoutingModule } from './join-address-routing.module';

import { JoinAddressPage } from './join-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinAddressPageRoutingModule
  ],
  declarations: [JoinAddressPage]
})
export class JoinAddressPageModule {}

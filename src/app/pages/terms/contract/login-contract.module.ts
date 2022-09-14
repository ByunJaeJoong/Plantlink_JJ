import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { loginContractPageRoutingModule } from './login-contract-routing.module';

import { loginContractPage } from './login-contract.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, loginContractPageRoutingModule],
  declarations: [loginContractPage],
})
export class loginContractPageModule {}

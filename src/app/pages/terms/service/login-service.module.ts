import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { loginServicePageRoutingModule } from './login-service-routing.module';

import { loginServicePage } from './login-service.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, loginServicePageRoutingModule],
  declarations: [loginServicePage],
})
export class loginServicePageModule {}

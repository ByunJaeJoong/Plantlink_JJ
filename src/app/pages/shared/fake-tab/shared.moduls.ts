import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { FakeTabComponent } from './fake-tab.component';
import { FakeTabOffComponent } from '../fake-tab-off/fake-tab-off.component';

@NgModule({
  declarations: [FakeTabComponent, FakeTabOffComponent],
  imports: [CommonModule, IonicModule],
  exports: [FakeTabComponent, FakeTabOffComponent],
})
export class SharedModule {}

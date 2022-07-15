import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { FakeTabComponent } from './fake-tab.component';

@NgModule({
  declarations: [FakeTabComponent],
  imports: [CommonModule, IonicModule],
  exports: [FakeTabComponent],
})
export class SharedModule {}

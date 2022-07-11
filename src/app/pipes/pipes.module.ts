import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocPipe } from './doc.pipe';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [DocPipe, SearchPipe],
  imports: [CommonModule],
  exports: [DocPipe, SearchPipe],
})
export class PipesModule {
  static forRoot() {
    return {
      ngModule: PipesModule,
      providers: [],
    };
  }
}

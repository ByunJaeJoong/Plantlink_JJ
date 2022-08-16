import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocPipe } from './doc.pipe';
import { SearchPipe } from './search.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { PlantSearchPipe } from './plantSearch.pipe';

@NgModule({
  declarations: [DocPipe, SearchPipe, DateFormatPipe, PlantSearchPipe],
  imports: [CommonModule],
  exports: [DocPipe, SearchPipe, DateFormatPipe, PlantSearchPipe],
})
export class PipesModule {}

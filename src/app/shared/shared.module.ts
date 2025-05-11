import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgSelectModule, // <-- this was missing
    FormsModule
  ],
  exports: [
    CommonModule,
    NgSelectModule,
    FormsModule
  ],
})
export class SharedModule {}

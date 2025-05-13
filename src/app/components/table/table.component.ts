import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-table',
  imports: [ CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
@Input () HeadersArray : string [] = [];
  @Input () DataArray : any [] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  @Input() route: any;
@Output() editRequest = new EventEmitter<number>();
@Output() deleteRequest = new EventEmitter<number>();



  constructor(private router: Router) {}

  edit(index: number) {
  this.editRequest.emit(index);
}

delete(index: number) {
  this.deleteRequest.emit(index);
}



  sort(column: string) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.DataArray = [...this.DataArray].sort((a, b) => {
      const keys = Object.keys(a).sort();
      for (const key of keys) {
        if (key === column) {
          const type = typeof a[key];
          if (type === 'number') {
            return this.sortOrder === 'asc'
              ? a[key] - b[key]
              : b[key] - a[key];
          }
          if (type === 'string') {
            return this.sortOrder === 'asc'
              ? a[key].localeCompare(b[key])
              : b[key].localeCompare(a[key]);
          }
          if (a[key] instanceof Date) {
            return this.sortOrder === 'asc'
              ? a[key].getTime() - b[key].getTime()
              : b[key].getTime() - a[key].getTime();
          }
          break;
        }
      }
      return 0;
    });
  }

      ngOnChanges(): void {
/**********THIS FUNCTION WILL TRIGGER WHEN PARENT COMPONENT UPDATES 'someInput'**************/
//Write your code here
 // console.log(this.DataArray);
}

isPillValue(value: any): boolean {
  return typeof value === 'string' && ['Ready', 'Pending', 'Arrived', 'Cancelled', 'Dispatched', 'Possible'].includes(value);
}


    openRoute(id:any) {
      if(this.route!=undefined)
      this.router.navigateByUrl(this.route+"/"+id);

      
    }

  
  
}

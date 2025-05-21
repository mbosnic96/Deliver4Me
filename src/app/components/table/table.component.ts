import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {
  @Input() HeadersArray: { key: string; label: string }[] = [];
  @Input() DataArray: any[] = [];
  @Input() route?: string;

  @Output() editRequest = new EventEmitter<number>();
  @Output() deleteRequest = new EventEmitter<number>();

  sortOrder: 'asc' | 'desc' = 'asc';
  sortColumn: string = '';

  constructor(private router: Router) {}

  ngOnChanges(): void {
    // Optionally reset sorting on data change
    // this.sortColumn = '';
    // this.sortOrder = 'asc';
    // or you can trigger a default sort here if needed
  }

  sort(columnKey: string) {
    if (this.sortColumn === columnKey) {
      // toggle sort order if same column
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortOrder = 'asc';
    }

    this.DataArray = [...this.DataArray].sort((a, b) => {
      const valA = a[columnKey];
      const valB = b[columnKey];

      if (valA == null || valB == null) return 0;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // For date strings or Date objects (you might want to ensure date parsing)
      const dateA = new Date(valA);
      const dateB = new Date(valB);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return this.sortOrder === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      return 0;
    });
  }

  isPillValue(value: any): boolean {
    return (
      typeof value === 'string' &&
      ['Ready', 'Pending', 'Arrived', 'Cancelled', 'Dispatched', 'Possible'].includes(value)
    );
  }

  edit(index: number) {
    this.editRequest.emit(index);
  }

  delete(index: number) {
    this.deleteRequest.emit(index);
  }

  openRoute(id: any) {
    if (this.route) {
      this.router.navigateByUrl(`${this.route}/${id}`);
    }
  }
}

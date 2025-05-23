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
  @Input() HeadersArray: { key: string; label: string; sortable?: boolean }[] = [];
  @Input() DataArray: any[] = [];
  @Input() route?: string;

  @Output() editRequest = new EventEmitter<number>();
  @Output() viewRequest = new EventEmitter<number>();
  @Output() deleteRequest = new EventEmitter<number>();
  @Output() markAsDeliveredRequest = new EventEmitter<number>();
  @Output() cancelRequest = new EventEmitter<number>();

  sortOrder: 'asc' | 'desc' = 'asc';
  sortColumn: string = '';
  
  hasViewAction = false;
  hasEditAction = false;
  hasDeleteAction = false;
  hasMarkAsDeliveredAction = false;
  hasCancelAction = false;

  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.hasViewAction = this.viewRequest.observed;
    this.hasEditAction = this.editRequest.observed;
    this.hasDeleteAction = this.deleteRequest.observed;
    this.hasMarkAsDeliveredAction = this.markAsDeliveredRequest.observed;
    this.hasCancelAction = this.cancelRequest.observed;
  }

  sort(columnKey: string) {
    if (this.sortColumn === columnKey) {
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
      ['Ready', 'Pending', 'Arrived', 'Cancelled', 'Dispatched', 'Possible', 'Delivered'].includes(value)
    );
  }

  getPillClass(value: string): string {
    switch(value) {
      case 'Aktivan': return 'bg-primary';
      case 'Na čekanju': return 'bg-secondary';
      case 'Otkazan': return 'bg-danger';
      case 'Poslan': return 'bg-warning';
      case 'Dostavljen': return 'bg-success';
      default: return 'bg-primary';
    }
  }

  edit(index: number) {
    this.editRequest.emit(index);
  }

  delete(index: number) {
    this.deleteRequest.emit(index);
  }

  openRoute(index: number) {
    this.viewRequest.emit(index);
  }

  markAsDelivered(index: number) {
    this.markAsDeliveredRequest.emit(index);
  }

  cancel(index: number) {
    this.cancelRequest.emit(index);
  }
}
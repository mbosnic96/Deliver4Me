import { ChangeDetectorRef, Component } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { CommonModule } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddLoadComponent } from '../client-dashboard/add-load/add-load.component';
import { LoadService } from '../../../core/services/load.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-my-loads',
  imports: [TableComponent, CommonModule, FontAwesomeModule],
  templateUrl: './my-loads.component.html',
  styleUrl: './my-loads.component.css'
})
export class MyLoadsComponent {
  userLoads: any[] = [];

  constructor(private modalService: NgbModal, private loadService: LoadService, private cd: ChangeDetectorRef) { }

    ngOnInit() {
    this.fetchUserLoads();
  }

    fetchUserLoads() {
  this.loadService.getMyLoads().subscribe({
    next: (loads) => {
       this.userLoads = loads;
        this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Failed to fetch loads:', err);
    }
  });
}

 openAddModal() {
    const modalRef = this.modalService.open(AddLoadComponent, {
      size: 'xl',
      backdrop: 'static'
    });
    
  }
  onDelete(){
    console.log('Delete request received');
  }

  editLoad(index: number) {
  const load = this.userLoads[index];
    console.log('Edit request for load:', load);
  const modalRef = this.modalService.open(AddLoadComponent, {
    size: 'xl',
    backdrop: 'static'
  });

  modalRef.componentInstance.loadData = load;

  modalRef.result.then((result) => {
    if (result === 'success') {
      this.fetchUserLoads(); // Refresh list
    }
  });
}

}

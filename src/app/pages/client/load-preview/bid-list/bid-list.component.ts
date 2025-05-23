import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { BidService } from '../../../../core/services/bid.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-bid-list',
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './bid-list.component.html',
  styleUrl: './bid-list.component.css'
})
export class BidListComponent {
 @Input() loadId: string = '';
  bids: any[] = [];

  constructor(private bidService: BidService, private toastr: ToastrService,
    private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchBids();
  }

  fetchBids() {
    this.bidService.getBidsForLoad(this.loadId).subscribe((res: any) => {
      this.bids = res;
      
    this.cd.detectChanges();
      console.log('Bid ' + JSON.stringify(res));

    });
  }

  accept(bidId: string) {
    this.bidService.acceptBid(this.loadId, bidId).subscribe({
      next: () => {
        this.toastr.success('Bid accepted');
        this.fetchBids();
        
    this.cd.detectChanges();
      },
      error: err => this.toastr.error(err.error || 'Error accepting bid')
    });
  }


}

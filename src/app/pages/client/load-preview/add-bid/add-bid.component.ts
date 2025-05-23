import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { BidService } from '../../../../core/services/bid.service';
import { ToastrService } from 'ngx-toastr';
import { DriverService } from '../../../../core/services/driver.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-bid',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-bid.component.html',
  styleUrl: './add-bid.component.css'
})
export class AddBidComponent {
    @Input() loadId: string = '';
  price: number = 0;
  message: string = '';
  vehicleId: string = '';
  vehicles: any[] = [];

  constructor(
    private bidService: BidService,
    private toastr: ToastrService,
    private driverService: DriverService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.driverService.getVehicles().subscribe({
      next: (res: any[]) => this.vehicles = res,
      error: err => this.toastr.error('Greška s dohvatanjem vozila.')
    });
    
      this.cd.detectChanges();
  }

  submitBid() {
      this.bidService.placeBid(this.loadId, this.price, this.message, this.vehicleId).subscribe({
      next: () => this.toastr.success('Ponuda poslana'),
      error: err => this.toastr.error(err.error || 'Greška u slanju ponude.')
    });
  }
}
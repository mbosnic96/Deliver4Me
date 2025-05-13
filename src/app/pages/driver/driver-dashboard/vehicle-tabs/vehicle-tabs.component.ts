import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DriverService } from '../../../../core/services/driver.service';

@Component({
  selector: 'app-vehicle-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-tabs.component.html',
  styleUrls: ['./vehicle-tabs.component.css']
})
export class VehicleTabsComponent implements OnInit {
  vehicles: any[] = [];
  activeTab: string | null = null;
  isLoading = true;

  constructor(
    private driverService: DriverService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles(): void {
    this.isLoading = true;
    this.driverService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        if (this.vehicles.length > 0) {
          this.activeTab = this.vehicles[0].id;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching vehicles', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  setActiveTab(id: string): void {
    this.activeTab = id;
  }
}
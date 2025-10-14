import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AdminService, type AdminStats } from '../../core/services/admin.service';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NavbarComponent, BaseChartDirective],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);

  stats: AdminStats | null = null;
  isLoading = true;

  // Chart data
  userRoleChartData: any;
  productStatusChartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.loadStats();
    this.initializeChartOptions();
  }

  loadStats(): void {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
        this.prepareChartData();
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isLoading = false;
      }
    });
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#FFD700',
          bodyColor: '#FFFFFF',
          cornerRadius: 8,
          displayColors: true
        }
      }
    };
  }

  private prepareChartData(): void {
    if (!this.stats) return;

    // User roles chart
    this.userRoleChartData = {
      labels: ['Utilisateurs', 'VIP', 'Modérateurs', 'Administrateurs'],
      datasets: [{
        data: [
          this.stats.totalUsers - this.stats.vipUsers - this.stats.moderatorUsers - this.stats.adminUsers,
          this.stats.vipUsers,
          this.stats.moderatorUsers,
          this.stats.adminUsers
        ],
        backgroundColor: [
          '#FFD700', // Yellow for regular users
          '#FCD116', // Gold for VIP
          '#00853F', // Green for moderators
          '#CE1126'  // Red for admins
        ],
        borderColor: [
          '#FFC700',
          '#E6B800',
          '#006830',
          '#A80F1F'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#FFE44D',
          '#FCE45D',
          '#34D399',
          '#F87171'
        ]
      }]
    };

    // Product status chart
    this.productStatusChartData = {
      labels: ['Validés', 'En attente', 'Rejetés'],
      datasets: [{
        data: [
          this.stats.validProducts,
          this.stats.pendingProducts,
          this.stats.deletedProducts
        ],
        backgroundColor: [
          '#10B981', // Green for valid
          '#F59E0B', // Orange for pending
          '#EF4444'  // Red for rejected
        ],
        borderColor: [
          '#059669',
          '#D97706',
          '#DC2626'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#34D399',
          '#FBBF24',
          '#F87171'
        ]
      }]
    };
  }
}

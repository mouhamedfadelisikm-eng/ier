import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { HeatmapPoint } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  readonly currentUser = this.authService.currentUser;

  // Heatmap State
  readonly heatmapPoints = signal<HeatmapPoint[]>([]);
  readonly isLoadingHeatmap = signal<boolean>(true);
  readonly heatmapError = signal<string | null>(null);

  // Computations based solely on real API data
  readonly totalPoints = computed(() => this.heatmapPoints().length);
  readonly totalWeight = computed(() =>
    this.heatmapPoints().reduce((acc, curr) => acc + (curr.weight || 0), 0)
  );
  readonly distinctZonesCount = computed(() => {
    const zones = new Set(
      this.heatmapPoints()
        .map(p => p.zone_nom)
        .filter((z): z is string => !!z)
    );
    return zones.size;
  });

  ngOnInit(): void {
    this.loadHeatmap();
  }

  loadHeatmap(): void {
    this.isLoadingHeatmap.set(true);
    this.heatmapError.set(null);

    this.dashboardService.getHeatmapData().subscribe({
      next: (points: HeatmapPoint[]) => {
        this.heatmapPoints.set(points || []);
        this.isLoadingHeatmap.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoadingHeatmap.set(false);
        this.heatmapError.set(
          err.status === 403
            ? 'Accès refusé (rôle admin requis).'
            : 'Impossible de charger les données cartographiques réelles de l\'API.'
        );
      }
    });
  }

  getWeightSeverity(weight: number): 'high' | 'medium' | 'low' {
    if (weight >= 5) return 'high';
    if (weight >= 2) return 'medium';
    return 'low';
  }
}

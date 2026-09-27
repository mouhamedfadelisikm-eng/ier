import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { HeatmapPoint } from '../../core/models/dashboard.model';
import { MapPoint } from '../../core/models/map.model';
import { MapShellComponent } from '../../shared/ui/map-shell/map-shell.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MapShellComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  readonly currentUser = this.authService.currentUser;
  readonly heatmapPoints = signal<HeatmapPoint[]>([]);
  readonly isLoadingHeatmap = signal(true);
  readonly heatmapError = signal<string | null>(null);
  readonly lastSyncedAt = signal<Date | null>(null);

  readonly mapPoints = computed<MapPoint[]>(() =>
    this.heatmapPoints().map((point, index) => ({
      id: point.zone_id ? 'heatmap-' + point.zone_id : 'heatmap-' + index,
      latitude: point.latitude,
      longitude: point.longitude,
      kind: 'heatmap',
      weight: point.weight,
      label: point.zone_nom || 'Point chaud'
    }))
  );

  readonly totalPoints = computed(() => this.heatmapPoints().length);

  readonly totalWeight = computed(() =>
    this.heatmapPoints().reduce((acc, curr) => acc + (curr.weight || 0), 0)
  );

  readonly distinctZonesCount = computed(() => {
    const zones = new Set(
      this.heatmapPoints()
        .map(point => point.zone_nom)
        .filter((zone): zone is string => !!zone)
    );

    return zones.size;
  });

  readonly topZones = computed(() => {
    const zones = new Map<string, { name: string; weight: number; zoneId: number | null }>();

    for (const point of this.heatmapPoints()) {
      const key = point.zone_id !== null
        ? String(point.zone_id)
        : point.zone_nom || String(point.latitude) + ',' + String(point.longitude);

      const current = zones.get(key);

      if (current) {
        current.weight += point.weight || 0;
        continue;
      }

      zones.set(key, {
        name: point.zone_nom || 'Zone non nommée',
        weight: point.weight || 0,
        zoneId: point.zone_id
      });
    }

    return Array.from(zones.values())
      .sort((left, right) => right.weight - left.weight)
      .slice(0, 5);
  });

  readonly maxZoneWeight = computed(() => this.topZones()[0]?.weight || 1);

  ngOnInit(): void {
    this.loadHeatmap();
  }

  loadHeatmap(): void {
    this.isLoadingHeatmap.set(true);
    this.heatmapError.set(null);

    this.dashboardService.getHeatmapData().subscribe({
      next: points => {
        this.heatmapPoints.set(points || []);
        this.lastSyncedAt.set(new Date());
        this.isLoadingHeatmap.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoadingHeatmap.set(false);
        this.heatmapError.set(
          err.status === 403
            ? 'Accès refusé. Les données cartographiques nécessitent les droits administrateur.'
            : 'Impossible de synchroniser les données cartographiques de l’API.'
        );
      }
    });
  }

  getWeightSeverity(weight: number): 'high' | 'medium' | 'low' {
    if (weight >= 5) return 'high';
    if (weight >= 2) return 'medium';
    return 'low';
  }

  getZoneBarWidth(weight: number): number {
    return Math.max(8, Math.round((weight / this.maxZoneWeight()) * 100));
  }
}

import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, Subscription, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SignalementService } from '../../core/services/signalement.service';
import { Signalement } from '../../core/models/signalement.model';
import { MapPoint } from '../../core/models/map.model';
import { MapShellComponent } from '../../shared/ui/map-shell/map-shell.component';
import { formatPriorite, formatStatut } from '../../core/models/signalement-constants';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [CommonModule, RouterLink, MapShellComponent],
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit, OnDestroy {
  private readonly signalementService = inject(SignalementService);
  private readonly router = inject(Router);

  readonly signalements = signal<Signalement[]>([]);
  readonly selectedSignalement = signal<Signalement | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly recentlyCreatedIds = signal<Set<number>>(new Set());

  readonly mapPoints = computed<MapPoint[]>(() =>
    this.signalements().map(item => ({
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      kind: 'signalement',
      priority: item.priorite,
      status: item.statut,
      isNew: this.recentlyCreatedIds().has(item.id),
      label: item.description || 'Signalement #' + item.id
    }))
  );

  readonly newCount = computed(() => this.recentlyCreatedIds().size);

  private pollingSubscription?: Subscription;
  private knownIds = new Set<number>();
  private firstLoad = true;
  private newTimers = new Map<number, ReturnType<typeof setTimeout>>();

  ngOnInit(): void {
    this.pollingSubscription = timer(0, 15000)
      .pipe(
        switchMap(() =>
          this.signalementService.getAll(1).pipe(
            catchError((err: HttpErrorResponse) => {
              this.errorMessage.set(
                err.status === 403
                  ? 'Accès refusé pour la supervision des signalements.'
                  : 'Impossible de récupérer les signalements.'
              );
              this.isLoading.set(false);
              return EMPTY;
            })
          )
        )
      )
      .subscribe({
        next: response => {
        this.errorMessage.set(null);
        this.handleSignalements(response.data || []);
      }
      });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
    for (const timeout of this.newTimers.values()) {
      clearTimeout(timeout);
    }
    this.newTimers.clear();
  }

  selectPoint(point: MapPoint): void {
    const signalement = this.signalements().find(item => item.id === Number(point.id));
    this.selectedSignalement.set(signalement ?? null);
  }

  refresh(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.signalementService.getAll(1).subscribe({
      next: response => this.handleSignalements(response.data || []),
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de récupérer les signalements.');
      }
    });
  }

  openDetail(): void {
    const item = this.selectedSignalement();
    if (!item) return;
    this.router.navigate(['/admin/signalements', item.id]);
  }

  formatStatus(status: string): string {
    return formatStatut(status);
  }

  formatPriority(priority?: string | null): string {
    return formatPriorite(priority);
  }

  private handleSignalements(items: Signalement[]): void {
    if (!this.firstLoad) {
      for (const item of items) {
        if (!this.knownIds.has(item.id)) {
          this.markAsNew(item.id);
        }
      }
    }

    this.knownIds = new Set(items.map(item => item.id));
    this.signalements.set(items);
    this.isLoading.set(false);
    this.firstLoad = false;
  }

  private markAsNew(id: number): void {
    this.recentlyCreatedIds.update(ids => new Set(ids).add(id));

    const existingTimer = this.newTimers.get(id);
    if (existingTimer) clearTimeout(existingTimer);

    const timerId = setTimeout(() => {
      this.recentlyCreatedIds.update(ids => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
      this.newTimers.delete(id);
    }, 6500);

    this.newTimers.set(id, timerId);
  }
}

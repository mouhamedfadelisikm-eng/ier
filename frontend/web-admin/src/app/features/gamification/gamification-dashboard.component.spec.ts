import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { GamificationService } from '../../core/services/gamification.service';
import { GamificationDashboardComponent } from './gamification-dashboard.component';

describe('GamificationDashboardComponent', () => {
  let fixture: ComponentFixture<GamificationDashboardComponent>;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamificationDashboardComponent],
      providers: [GamificationService, provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(GamificationDashboardComponent);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('charge les données', () => {
    fixture.detectChanges();
    http.expectOne(r => r.url.includes('/gamification/leaderboard')).flush({
      data: [{ rank: 1, user: { id: 1, nom: 'Doe', prenom: 'Jane' }, total_points: 100 }],
      meta: { limit: 100, count: 1 }
    });
    http.expectOne(r => r.url.includes('/historique-points')).flush({
      data: [{ id: 1, nombre_points: 100, motif: 'Clôture', date_attribution: '2026-09-24' }],
      meta: { total: 1 }
    });
    expect(fixture.componentInstance.total()).toBe(100);
    expect(fixture.componentInstance.participants()).toBe(1);
    expect(fixture.componentInstance.loading()).toBe(false);
  });
});

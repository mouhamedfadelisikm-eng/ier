import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/auth/auth.service';
import { TokenService } from '../../core/auth/token.service';
import { HeatmapPoint } from '../../core/models/dashboard.model';
import { User } from '../../core/models/user.model';

describe('DashboardComponent', () => {
  let httpMock: HttpTestingController;
  let authService: AuthService;

  const mockAdminUser: User = {
    id: 1,
    nom: 'Diallo',
    prenom: 'Admin',
    email: 'admin@isi-ecoreport.sn',
    role: 'admin',
    roles: ['admin']
  };

  const mockHeatmapData: HeatmapPoint[] = [
    {
      latitude: 14.6928,
      longitude: -17.4467,
      weight: 5,
      zone_id: 1,
      zone_nom: 'Plateau'
    },
    {
      latitude: 14.7167,
      longitude: -17.4677,
      weight: 3,
      zone_id: 2,
      zone_nom: 'Medina'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        DashboardService,
        AuthService,
        TokenService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'admin/dashboard', component: DashboardComponent },
          { path: 'login', children: [] },
          { path: 'admin/signalements', children: [] },
          { path: 'admin/affectations', children: [] },
          { path: 'admin/interventions', children: [] },
          { path: 'admin/utilisateurs', children: [] }
        ])
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    authService.currentUser.set(mockAdminUser);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the dashboard component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne('/api/dashboard/heatmap');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeatmapData);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.currentUser()?.prenom).toBe('Admin');
  });

  it('should load heatmap data successfully and calculate real metrics correctly', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/dashboard/heatmap');
    req.flush(mockHeatmapData);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.isLoadingHeatmap()).toBe(false);
    expect(component.heatmapError()).toBeNull();
    expect(component.heatmapPoints()).toEqual(mockHeatmapData);

    // Metrics calculations from real data
    expect(component.totalPoints()).toBe(2);
    expect(component.totalWeight()).toBe(8); // 5 + 3
    expect(component.distinctZonesCount()).toBe(2); // Plateau, Medina
  });

  it('should handle empty heatmap points array correctly', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/dashboard/heatmap');
    req.flush([]);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.isLoadingHeatmap()).toBe(false);
    expect(component.heatmapPoints()).toEqual([]);
    expect(component.totalPoints()).toBe(0);
    expect(component.totalWeight()).toBe(0);
    expect(component.distinctZonesCount()).toBe(0);
  });

  it('should handle API error gracefully when loading heatmap', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/dashboard/heatmap');
    req.flush('Error loading heatmap', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.isLoadingHeatmap()).toBe(false);
    expect(component.heatmapError()).toBeTruthy();
    expect(component.heatmapPoints()).toEqual([]);
  });

  it('should reload heatmap data when loadHeatmap is called (refresh)', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    // Initial load
    const req1 = httpMock.expectOne('/api/dashboard/heatmap');
    req1.flush(mockHeatmapData);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.totalPoints()).toBe(2);

    // Trigger refresh
    component.loadHeatmap();
    expect(component.isLoadingHeatmap()).toBe(true);

    const req2 = httpMock.expectOne('/api/dashboard/heatmap');
    expect(req2.request.method).toBe('GET');
    req2.flush([
      {
        latitude: 14.7,
        longitude: -17.45,
        weight: 10,
        zone_id: 3,
        zone_nom: 'Almadies'
      }
    ]);
    fixture.detectChanges();

    expect(component.isLoadingHeatmap()).toBe(false);
    expect(component.totalPoints()).toBe(1);
    expect(component.totalWeight()).toBe(10);
    expect(component.distinctZonesCount()).toBe(1);
  });

  it('should determine correct weight severity category', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/dashboard/heatmap');
    req.flush(mockHeatmapData);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.getWeightSeverity(10)).toBe('high');
    expect(component.getWeightSeverity(5)).toBe('high');
    expect(component.getWeightSeverity(3)).toBe('medium');
    expect(component.getWeightSeverity(2)).toBe('medium');
    expect(component.getWeightSeverity(1)).toBe('low');
  });
});

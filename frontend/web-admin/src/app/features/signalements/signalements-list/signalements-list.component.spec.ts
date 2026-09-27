import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SignalementsListComponent } from './signalements-list.component';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement } from '../../../core/models/signalement.model';
import { MapPoint } from '../../../core/models/map.model';
import { MapShellComponent } from '../../../shared/ui/map-shell/map-shell.component';

@Component({
  selector: 'app-map-shell',
  standalone: true,
  template: '<ng-content></ng-content>'
})
class MockMapShellComponent {
  @Input() points: MapPoint[] = [];
  @Input() fitToPoints = true;
  @Output() pointSelected = new EventEmitter<MapPoint>();
}

describe('SignalementsListComponent', () => {
  let component: SignalementsListComponent;
  let fixture: ComponentFixture<SignalementsListComponent>;
  let httpMock: HttpTestingController;

  const mockSignalements: Signalement[] = [
    {
      id: 1,
      description: 'Déchets plastique Plateau',
      latitude: 14.6928,
      longitude: -17.4467,
      statut: 'en_attente_validation',
      priorite: 'normale',
      user: { id: 1, prenom: 'Moussa', nom: 'Diop', email: 'moussa@test.com' },
      zone: { id: 1, nom_zone: 'Plateau' }
    },
    {
      id: 2,
      description: 'Dépôt sauvage Medina',
      latitude: 14.7167,
      longitude: -17.4677,
      statut: 'valide',
      priorite: 'urgente',
      user: { id: 2, prenom: 'Fatou', nom: 'Sow', email: 'fatou@test.com' },
      zone: { id: 2, nom_zone: 'Medina' }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalementsListComponent],
      providers: [
        SignalementService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'admin/signalements', component: SignalementsListComponent },
          { path: 'admin/signalements/:id', children: [] }
        ])
      ]
    })
      .overrideComponent(SignalementsListComponent, {
        remove: { imports: [MapShellComponent] },
        add: { imports: [MockMapShellComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(SignalementsListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushSignalements(data = mockSignalements): void {
    const req = httpMock.expectOne(req => req.url.includes('/signalements'));
    req.flush({
      data,
      meta: { current_page: 1, last_page: 1, total: data.length, from: data.length ? 1 : 0, to: data.length, per_page: 15, path: '/api/signalements' }
    });
    fixture.detectChanges();
  }

  it('should create the component and load signalements successfully', () => {
    fixture.detectChanges();
    flushSignalements();

    expect(component).toBeTruthy();
    expect(component.isLoading()).toBe(false);
    expect(component.signalements().length).toBe(2);
    expect(component.errorMessage()).toBeNull();
  });

  it('should handle empty state correctly', () => {
    fixture.detectChanges();
    flushSignalements([]);

    expect(component.signalements().length).toBe(0);
    expect(component.filteredSignalements().length).toBe(0);
    expect(component.mapPoints()).toEqual([]);
  });

  it('should handle API error gracefully on load', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(req => req.url.includes('/signalements'));
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBeTruthy();
    expect(component.signalements().length).toBe(0);
  });

  it('should derive map points from the filtered signalements', () => {
    fixture.detectChanges();
    flushSignalements();

    expect(component.mapPoints()).toEqual([
      {
        id: 1,
        latitude: 14.6928,
        longitude: -17.4467,
        kind: 'signalement',
        priority: 'normale',
        status: 'en_attente_validation',
        label: 'Déchets plastique Plateau'
      },
      {
        id: 2,
        latitude: 14.7167,
        longitude: -17.4677,
        kind: 'signalement',
        priority: 'urgente',
        status: 'valide',
        label: 'Dépôt sauvage Medina'
      }
    ]);

    component.filterPriority.set('urgente');

    expect(component.mapPoints()).toEqual([
      {
        id: 2,
        latitude: 14.7167,
        longitude: -17.4677,
        kind: 'signalement',
        priority: 'urgente',
        status: 'valide',
        label: 'Dépôt sauvage Medina'
      }
    ]);
  });

  it('should support validation action for en_attente_validation signalement', () => {
    fixture.detectChanges();
    flushSignalements();

    component.validate(1, new MouseEvent('click'));

    const valReq = httpMock.expectOne(req => req.url.includes('/signalements/1/valider'));
    expect(valReq.request.method).toBe('POST');
    valReq.flush({ data: { ...mockSignalements[0], statut: 'valide' } });

    expect(component.signalements().find(signalement => signalement.id === 1)?.statut).toBe('valide');
  });
});

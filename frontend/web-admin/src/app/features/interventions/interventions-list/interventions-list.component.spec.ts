import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { InterventionsListComponent } from './interventions-list.component';
import { InterventionService } from '../../../core/services/intervention.service';
import { Intervention } from '../../../core/models/intervention.model';
import { MapPoint } from '../../../core/models/map.model';
import { MapShellComponent } from '../../../shared/ui/map-shell/map-shell.component';

@Component({
  selector: 'app-map-shell',
  standalone: true,
  template: ''
})
class MockMapShellComponent {
  @Input() points: MapPoint[] = [];
  @Input() fitToPoints = true;
  @Output() pointSelected = new EventEmitter<MapPoint>();
}

describe('InterventionsListComponent', () => {
  let fixture: ComponentFixture<InterventionsListComponent>;
  let component: InterventionsListComponent;
  let http: HttpTestingController;

  const mockInterventions: Intervention[] = [
    {
      id: 1,
      date_heure_debut: '2026-09-24 10:00:00',
      statut: 'en_cours',
      compte_rendu: 'Collecte en cours',
      affectation: {
        id: 10,
        date_heure_affectation: '2026-09-24 09:30:00',
        observation: null,
        equipe: { id: 3, nom_equipe: 'Équipe Plateau' },
        signalement: {
          id: 21,
          description: 'Dépôt sauvage Plateau',
          latitude: 14.6928,
          longitude: -17.4467,
          statut: 'en_intervention',
          priorite: 'haute',
          user: { id: 1, prenom: 'Moussa', nom: 'Diop', email: 'moussa@test.com' },
          zone: { id: 1, nom_zone: 'Plateau' }
        }
      }
    },
    {
      id: 2,
      date_heure_debut: '2026-09-24 08:15:00',
      statut: 'terminee',
      affectation: {
        id: 11,
        date_heure_affectation: '2026-09-24 07:45:00',
        observation: null,
        equipe: { id: 4, nom_equipe: 'Équipe Médina' },
        signalement: {
          id: 22,
          description: 'Déchets encombrants Médina',
          latitude: 14.7167,
          longitude: -17.4677,
          statut: 'cloture',
          priorite: 'normale',
          user: { id: 2, prenom: 'Fatou', nom: 'Sow', email: 'fatou@test.com' },
          zone: { id: 2, nom_zone: 'Médina' }
        }
      }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionsListComponent],
      providers: [
        InterventionService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'admin/interventions', component: InterventionsListComponent },
          { path: 'admin/interventions/:id', children: [] }
        ])
      ]
    })
      .overrideComponent(InterventionsListComponent, {
        remove: { imports: [MapShellComponent] },
        add: { imports: [MockMapShellComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(InterventionsListComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function flushInterventions(data = mockInterventions): void {
    const req = http.expectOne(req => req.url.includes('/interventions'));
    req.flush({
      data,
      meta: {
        current_page: 1,
        last_page: 1,
        total: data.length,
        from: data.length ? 1 : 0,
        to: data.length,
        per_page: 15
      }
    });
    fixture.detectChanges();
  }

  it('charge les interventions', () => {
    fixture.detectChanges();
    flushInterventions();

    expect(component.isLoading()).toBe(false);
    expect(component.interventions().length).toBe(2);
    expect(component.errorMessage()).toBeNull();
  });

  it('gère une erreur de chargement', () => {
    fixture.detectChanges();
    http.expectOne(req => req.url.includes('/interventions')).flush('error', {
      status: 500,
      statusText: 'Server Error'
    });

    expect(component.errorMessage()).toBeTruthy();
  });

  it('projette les interventions localisées sur la carte', () => {
    fixture.detectChanges();
    flushInterventions();

    expect(component.mapPoints()).toEqual([
      {
        id: 1,
        latitude: 14.6928,
        longitude: -17.4467,
        kind: 'intervention',
        status: 'en_cours',
        priority: 'haute',
        label: 'Dépôt sauvage Plateau'
      },
      {
        id: 2,
        latitude: 14.7167,
        longitude: -17.4677,
        kind: 'intervention',
        status: 'terminee',
        priority: 'normale',
        label: 'Déchets encombrants Médina'
      }
    ]);

    component.statusFilter.set('en_cours');

    expect(component.mapPoints()).toEqual([
      {
        id: 1,
        latitude: 14.6928,
        longitude: -17.4467,
        kind: 'intervention',
        status: 'en_cours',
        priority: 'haute',
        label: 'Dépôt sauvage Plateau'
      }
    ]);
  });
});

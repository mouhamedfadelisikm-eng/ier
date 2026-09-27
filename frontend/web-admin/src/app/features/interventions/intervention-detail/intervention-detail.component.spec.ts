import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { InterventionDetailComponent } from './intervention-detail.component';
import { InterventionService } from '../../../core/services/intervention.service';
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

describe('InterventionDetailComponent', () => {
  let fixture: ComponentFixture<InterventionDetailComponent>;
  let component: InterventionDetailComponent;
  let http: HttpTestingController;

  const intervention = {
    id: 1,
    date_heure_debut: '2026-09-24 10:00:00',
    statut: 'en_cours' as const,
    affectation: {
      id: 10,
      date_heure_affectation: '2026-09-24 09:30:00',
      observation: 'Accès côté nord',
      equipe: { id: 3, nom_equipe: 'Équipe Plateau' },
      signalement: {
        id: 21,
        description: 'Dépôt sauvage Plateau',
        latitude: 14.6928,
        longitude: -17.4467,
        statut: 'en_intervention' as const,
        priorite: 'haute' as const,
        user: { id: 1, prenom: 'Moussa', nom: 'Diop', email: 'moussa@test.com' },
        zone: { id: 1, nom_zone: 'Plateau' }
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionDetailComponent],
      providers: [
        InterventionService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    })
      .overrideComponent(InterventionDetailComponent, {
        remove: { imports: [MapShellComponent] },
        add: { imports: [MockMapShellComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(InterventionDetailComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge le détail', () => {
    fixture.detectChanges();
    const req = http.expectOne(r => r.url.endsWith('/interventions/1'));
    req.flush({ data: intervention });

    expect(component.intervention()?.id).toBe(1);
    expect(component.statut()).toBe('en_cours');
  });

  it('projette la localisation de l’intervention sur la carte', () => {
    fixture.detectChanges();
    http.expectOne(r => r.url.endsWith('/interventions/1')).flush({ data: intervention });
    fixture.detectChanges();

    expect(component.mapPoint()).toEqual({
      id: 1,
      latitude: 14.6928,
      longitude: -17.4467,
      kind: 'intervention',
      priority: 'haute',
      status: 'en_cours',
      label: 'Dépôt sauvage Plateau'
    });
  });

  it('met à jour une intervention', () => {
    fixture.detectChanges();
    http.expectOne(r => r.url.endsWith('/interventions/1')).flush({ data: intervention });

    component.compteRendu.set('Nettoyage effectué');
    component.save();

    const req = http.expectOne(r => r.url.endsWith('/interventions/1'));
    expect(req.request.method).toBe('PUT');
    req.flush({ data: { ...intervention, statut: 'en_cours', compte_rendu: 'Nettoyage effectué' } });

    expect(component.successMessage()).toBe('Intervention mise à jour.');
  });
});

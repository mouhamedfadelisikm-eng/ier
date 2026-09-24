import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AffectationsListComponent } from './affectations-list.component';
import { AffectationService } from '../../../core/services/affectation.service';
import { Affectation } from '../../../core/models/affectation.model';

describe('AffectationsListComponent', () => {
  let component: AffectationsListComponent;
  let fixture: ComponentFixture<AffectationsListComponent>;
  let httpMock: HttpTestingController;

  const mockAffectations: Affectation[] = [
    {
      id: 1,
      date_heure_affectation: '2026-09-24 10:00:00',
      observation: 'Intervention urgente Plateau',
      equipe: { id: 1, nom_equipe: 'Equipe Alpha' },
      signalement: { id: 1, description: 'Déchets', latitude: 14.69, longitude: -17.44, statut: 'priorise', priorite: 'urgente', zone: { id: 1, nom_zone: 'Plateau' } }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffectationsListComponent],
      providers: [
        AffectationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'admin/affectations', component: AffectationsListComponent },
          { path: 'admin/affectations/:id', children: [] }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AffectationsListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component and load affectations successfully', () => {
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne(req => req.url.includes('/affectations'));
    expect(req.request.method).toBe('GET');
    req.flush({
      data: mockAffectations,
      meta: { current_page: 1, last_page: 1, total: 1, from: 1, to: 1, per_page: 15, path: '/api/affectations' }
    });
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.isLoading()).toBe(false);
    expect(component.affectations().length).toBe(1);
    expect(component.errorMessage()).toBeNull();
  });

  it('should handle API error gracefully on load', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(req => req.url.includes('/affectations'));
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBeTruthy();
  });
});

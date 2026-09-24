import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AffectationDetailComponent } from './affectation-detail.component';
import { AffectationService } from '../../../core/services/affectation.service';
import { Affectation } from '../../../core/models/affectation.model';

describe('AffectationDetailComponent', () => {
  let component: AffectationDetailComponent;
  let fixture: ComponentFixture<AffectationDetailComponent>;
  let httpMock: HttpTestingController;

  const mockAffectation: Affectation = {
    id: 1,
    date_heure_affectation: '2026-09-24 10:00:00',
    observation: 'Intervention urgente Plateau',
    equipe: { id: 1, nom_equipe: 'Equipe Alpha' },
    signalement: { id: 1, description: 'Déchets', latitude: 14.69, longitude: -17.44, statut: 'affecte', priorite: 'urgente', zone: { id: 1, nom_zone: 'Plateau' } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffectationDetailComponent],
      providers: [
        AffectationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'admin/affectations', children: [] },
          { path: 'admin/affectations/:id', component: AffectationDetailComponent }
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AffectationDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and load affectation detail successfully', () => {
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne(req => req.url.includes('/affectations/1'));
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockAffectation });
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.isLoading()).toBe(false);
    expect(component.affectation()?.id).toBe(1);
    expect(component.affectation()?.observation).toBe('Intervention urgente Plateau');
  });

  it('should handle 404 error when affectation not found', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(req => req.url.includes('/affectations/1'));
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Affectation introuvable.');
  });
});

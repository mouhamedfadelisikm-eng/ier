import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SignalementDetailComponent } from './signalement-detail.component';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement } from '../../../core/models/signalement.model';

describe('SignalementDetailComponent', () => {
  let component: SignalementDetailComponent;
  let fixture: ComponentFixture<SignalementDetailComponent>;
  let httpMock: HttpTestingController;

  const mockSignalement: Signalement = {
    id: 1,
    description: 'Détail signalement test',
    latitude: 14.6928,
    longitude: -17.4467,
    statut: 'en_attente_validation',
    priorite: 'normale',
    user: { id: 1, prenom: 'Moussa', nom: 'Diop', email: 'moussa@test.com' },
    zone: { id: 1, nom_zone: 'Plateau' },
    type_dechets: [
      { id: 1, libelle: 'Plastique' }
    ],
    photos: [
      { id: 1, url: 'http://localhost/storage/photo1.jpg', description: 'Déchets' }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalementDetailComponent],
      providers: [
        SignalementService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'admin/signalements', children: [] },
          { path: 'admin/signalements/:id', component: SignalementDetailComponent }
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

    fixture = TestBed.createComponent(SignalementDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and load signalement detail successfully', () => {
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockSignalement });
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.isLoading()).toBe(false);
    expect(component.signalement()?.id).toBe(1);
    expect(component.signalement()?.description).toBe('Détail signalement test');
  });

  it('should handle 404 error when signalement not found', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Signalement introuvable.');
  });

  it('should execute validation action (POST /valider)', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    req.flush({ data: mockSignalement });
    fixture.detectChanges();

    component.validate();

    const valReq = httpMock.expectOne(req => req.url.includes('/signalements/1/valider'));
    expect(valReq.request.method).toBe('POST');
    valReq.flush({ data: { ...mockSignalement, statut: 'valide' } });

    expect(component.signalement()?.statut).toBe('valide');
  });

  it('should execute update and verify PUT payload does not contain statut or priorite', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    req.flush({ data: mockSignalement });
    fixture.detectChanges();

    component.editDescription.set('Description modifiée');
    component.saveEdition();

    const updateReq = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body.statut).toBeUndefined();
    expect(updateReq.request.body.priorite).toBeUndefined();
    expect(updateReq.request.body.description).toBe('Description modifiée');

    updateReq.flush({ data: { ...mockSignalement, description: 'Description modifiée' } });
    expect(component.signalement()?.description).toBe('Description modifiée');
    expect(component.isEditing()).toBe(false);
  });
});

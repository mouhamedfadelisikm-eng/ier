import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SignalementDetailComponent } from './signalement-detail.component';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement } from '../../../core/models/signalement.model';
import { environment } from '../../../../environments/environment';

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
    user: { id: 1, prenom: 'Moussa', nom: 'Diop', email: 'moussa@test.com', telephone: '+221770000000' },
    zone: { id: 1, nom_zone: 'Plateau' },
    type_dechets: [
      {
        id: 1,
        type_dechet_id: 1,
        libelle: 'Plastique',
        quantite_estime: 10,
        volume_estime: 2.5,
        dangerosite: 'eleve',
        remarque: 'Dangereux'
      }
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

  it('should create and load signalement detail with type_dechets pivot data successfully', () => {
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockSignalement });
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.isLoading()).toBe(false);
    expect(component.signalement()?.id).toBe(1);
    expect(component.signalement()?.type_dechets?.length).toBe(1);
    expect(component.signalement()?.type_dechets?.[0].quantite_estime).toBe(10);
    expect(component.signalement()?.type_dechets?.[0].dangerosite).toBe('eleve');
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

  it('should not send type_dechets when only description is modified (dirty checking check)', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    req.flush({ data: mockSignalement });
    fixture.detectChanges();

    component.startEditing();
    const zoneReq = httpMock.expectOne(req => req.url.includes('/zones'));
    zoneReq.flush({ data: [] });
    const typeReq = httpMock.expectOne(req => req.url.includes('/types-dechets'));
    typeReq.flush({ data: [] });

    component.editDescription.set('Description modifiée sans toucher aux déchets');
    component.saveEdition();

    const updateReq = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body.statut).toBeUndefined();
    expect(updateReq.request.body.priorite).toBeUndefined();
    expect(updateReq.request.body.description).toBe('Description modifiée sans toucher aux déchets');
    expect(updateReq.request.body.type_dechets).toBeUndefined(); // Crucial: should not be sent if unchanged

    updateReq.flush({ data: { ...mockSignalement, description: 'Description modifiée sans toucher aux déchets' } });
    expect(component.signalement()?.description).toBe('Description modifiée sans toucher aux déchets');
    expect(component.isEditing()).toBe(false);
  });

  it('should send type_dechets when waste types are modified', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    req.flush({ data: mockSignalement });
    fixture.detectChanges();

    component.startEditing();
    const zoneReq = httpMock.expectOne(req => req.url.includes('/zones'));
    zoneReq.flush({ data: [] });
    const typeReq = httpMock.expectOne(req => req.url.includes('/types-dechets'));
    typeReq.flush({ data: [] });

    component.editableTypeDechets.set([
      { type_dechet_id: 1, quantite_estime: 20, volume_estime: 4, dangerosite: 'faible', remarque: 'Modifié' }
    ]);
    component.saveEdition();

    const updateReq = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body.type_dechets).toBeDefined();
    expect(updateReq.request.body.type_dechets[0].quantite_estime).toBe(20);

    updateReq.flush({
      data: {
        ...mockSignalement,
        type_dechets: [{ id: 1, type_dechet_id: 1, libelle: 'Plastique', quantite_estime: 20, volume_estime: 4, dangerosite: 'faible', remarque: 'Modifié' }]
      }
    });
    expect(component.isEditing()).toBe(false);
  });

  it('should prevent duplicate waste types in editable list', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/signalements/1'));
    req.flush({ data: mockSignalement });
    fixture.detectChanges();

    component.startEditing();
    const zoneReq = httpMock.expectOne(req => req.url.includes('/zones'));
    zoneReq.flush({ data: [] });
    const typeReq = httpMock.expectOne(req => req.url.includes('/types-dechets'));
    typeReq.flush({ data: [{ id: 2, libelle: 'Verre', description: 'Verre brisé' }] });

    component.addWasteType(2);
    expect(component.editableTypeDechets().length).toBe(2);

    // Try adding duplicate type_dechet_id 2
    component.addWasteType(2);
    expect(component.editableTypeDechets().length).toBe(2); // Should not duplicate
  });
});

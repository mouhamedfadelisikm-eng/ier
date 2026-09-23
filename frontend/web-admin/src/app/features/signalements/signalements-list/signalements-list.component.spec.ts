import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SignalementsListComponent } from './signalements-list.component';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement } from '../../../core/models/signalement.model';

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
    }).compileComponents();

    fixture = TestBed.createComponent(SignalementsListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component and load signalements successfully', () => {
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne(req => req.url.includes('/signalements'));
    expect(req.request.method).toBe('GET');
    req.flush({
      data: mockSignalements,
      meta: { current_page: 1, last_page: 1, total: 2, from: 1, to: 2, per_page: 15, path: '/api/signalements' }
    });
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.isLoading()).toBe(false);
    expect(component.signalements().length).toBe(2);
    expect(component.errorMessage()).toBeNull();
  });

  it('should handle empty state correctly', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(req => req.url.includes('/signalements'));
    req.flush({
      data: [],
      meta: { current_page: 1, last_page: 1, total: 0, from: 0, to: 0, per_page: 15, path: '/api/signalements' }
    });
    fixture.detectChanges();

    expect(component.signalements().length).toBe(0);
    expect(component.filteredSignalements().length).toBe(0);
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

  it('should support validation action for en_attente_validation signalement', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/signalements'));
    req.flush({
      data: mockSignalements,
      meta: { current_page: 1, last_page: 1, total: 2, from: 1, to: 2, per_page: 15, path: '/api/signalements' }
    });
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.validate(1, event);

    const valReq = httpMock.expectOne(req => req.url.includes('/signalements/1/valider'));
    expect(valReq.request.method).toBe('POST');
    valReq.flush({ data: { ...mockSignalements[0], statut: 'valide' } });

    expect(component.signalements().find(s => s.id === 1)?.statut).toBe('valide');
  });
});

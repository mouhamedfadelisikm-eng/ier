import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SignalementService } from './signalement.service';
import { environment } from '../../../environments/environment';
import { Signalement } from '../models/signalement.model';

describe('SignalementService', () => {
  let service: SignalementService;
  let httpMock: HttpTestingController;

  const mockSignalement: Signalement = {
    id: 1,
    description: 'Déchets plastiques abandonnés',
    latitude: 14.6928,
    longitude: -17.4467,
    statut: 'en_attente_validation',
    priorite: 'normale'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SignalementService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(SignalementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch paginated list of signalements (GET /api/signalements)', () => {
    const mockResponse = {
      data: [mockSignalement],
      meta: { current_page: 1, last_page: 1, total: 1, from: 1, to: 1, per_page: 15, path: '/api/signalements' }
    };

    service.getAll(1).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/signalements?page=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch signalement detail by id (GET /api/signalements/{id})', () => {
    service.getById(1).subscribe(res => {
      expect(res.data.id).toBe(1);
      expect(res.data.description).toBe('Déchets plastiques abandonnés');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/signalements/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockSignalement });
  });

  it('should update signalement and ensure PUT payload NEVER sends statut or priorite', () => {
    const updatePayload = {
      description: 'Description mise à jour',
      zone_id: 2,
      type_dechets: []
    };

    service.update(1, updatePayload).subscribe(res => {
      expect(res.data.description).toBe('Description mise à jour');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/signalements/1`);
    expect(req.request.method).toBe('PUT');
    // Verify payload does not contain statut or priorite
    expect(req.request.body.statut).toBeUndefined();
    expect(req.request.body.priorite).toBeUndefined();
    expect(req.request.body.description).toBe('Description mise à jour');

    req.flush({ data: { ...mockSignalement, description: 'Description mise à jour' } });
  });

  it('should delete signalement (DELETE /api/signalements/{id})', () => {
    service.delete(1).subscribe(res => {
      expect(res).toBeFalsy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/signalements/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should validate signalement (POST /api/signalements/{id}/valider)', () => {
    service.validate(1).subscribe(res => {
      expect(res.data.statut).toBe('valide');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/signalements/1/valider`);
    expect(req.request.method).toBe('POST');
    req.flush({ data: { ...mockSignalement, statut: 'valide' } });
  });

  it('should reject signalement (POST /api/signalements/{id}/rejeter)', () => {
    service.reject(1).subscribe(res => {
      expect(res.data.statut).toBe('rejete');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/signalements/1/rejeter`);
    expect(req.request.method).toBe('POST');
    req.flush({ data: { ...mockSignalement, statut: 'rejete' } });
  });

  it('should prioritize signalement (POST /api/signalements/{id}/prioriser)', () => {
    service.prioritize(1, 'urgente').subscribe(res => {
      expect(res.data.priorite).toBe('urgente');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/signalements/1/prioriser`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ priorite: 'urgente' });
    req.flush({ data: { ...mockSignalement, priorite: 'urgente' } });
  });
});

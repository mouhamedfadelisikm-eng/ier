import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AffectationService } from './affectation.service';
import { environment } from '../../../environments/environment';
import { Affectation } from '../models/affectation.model';

describe('AffectationService', () => {
  let service: AffectationService;
  let httpMock: HttpTestingController;

  const mockAffectation: Affectation = {
    id: 1,
    date_heure_affectation: '2026-09-24 10:00:00',
    observation: 'Intervention urgente',
    equipe: { id: 1, nom_equipe: 'Equipe Alpha' },
    signalement: { id: 1, description: 'Test', latitude: 14.69, longitude: -17.44, statut: 'priorise' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AffectationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AffectationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch paginated list of affectations (GET /api/affectations)', () => {
    const mockResponse = {
      data: [mockAffectation],
      meta: { current_page: 1, last_page: 1, total: 1, from: 1, to: 1, per_page: 15, path: '/api/affectations' }
    };

    service.getAll(1).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/affectations?page=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch affectation detail by id (GET /api/affectations/{id})', () => {
    service.getById(1).subscribe(res => {
      expect(res.data.id).toBe(1);
      expect(res.data.observation).toBe('Intervention urgente');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/affectations/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockAffectation });
  });

  it('should create affectation (POST /api/affectations)', () => {
    const payload = {
      date_heure_affectation: '2026-09-24 10:00:00',
      equipe_id: 1,
      signalement_id: 1,
      observation: 'Test'
    };

    service.create(payload).subscribe(res => {
      expect(res.data.id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/affectations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ data: mockSignalementHelper(mockAffectation) });
  });

  it('should reassign affectation (POST /api/affectations/{id}/reaffecter)', () => {
    const payload = {
      date_heure_affectation: '2026-09-24 12:00:00',
      equipe_id: 2,
      observation: 'Réaffectation'
    };

    service.reassign(1, payload).subscribe(res => {
      expect(res.data.id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/affectations/1/reaffecter`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ data: mockAffectation });
  });

  it('should delete affectation (DELETE /api/affectations/{id})', () => {
    service.delete(1).subscribe(res => {
      expect(res).toBeFalsy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/affectations/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});

function mockSignalementHelper(a: Affectation) {
  return a;
}

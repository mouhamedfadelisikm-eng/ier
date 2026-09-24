import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { InterventionsListComponent } from './interventions-list.component';
import { InterventionService } from '../../../core/services/intervention.service';

describe('InterventionsListComponent', () => {
  let fixture: ComponentFixture<InterventionsListComponent>;
  let component: InterventionsListComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionsListComponent],
      providers: [InterventionService, provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(InterventionsListComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge les interventions', () => {
    fixture.detectChanges();
    const req = http.expectOne(r => r.url.includes('/interventions'));
    expect(req.request.method).toBe('GET');
    req.flush({ data: [{ id: 1, date_heure_debut: '2026-09-24 10:00:00', statut: 'en_cours' }] });
    expect(component.isLoading()).toBe(false);
    expect(component.interventions().length).toBe(1);
  });

  it('gère une erreur de chargement', () => {
    fixture.detectChanges();
    http.expectOne(r => r.url.includes('/interventions')).flush('error', { status: 500, statusText: 'Server Error' });
    expect(component.errorMessage()).toBeTruthy();
  });
});

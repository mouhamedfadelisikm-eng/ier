import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { InterventionDetailComponent } from './intervention-detail.component';
import { InterventionService } from '../../../core/services/intervention.service';

describe('InterventionDetailComponent', () => {
  let fixture: ComponentFixture<InterventionDetailComponent>;
  let component: InterventionDetailComponent;
  let http: HttpTestingController;

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
    }).compileComponents();
    fixture = TestBed.createComponent(InterventionDetailComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge le détail', () => {
    fixture.detectChanges();
    const req = http.expectOne(r => r.url.endsWith('/interventions/1'));
    req.flush({ data: { id: 1, date_heure_debut: '2026-09-24 10:00:00', statut: 'en_cours' } });
    expect(component.intervention()?.id).toBe(1);
    expect(component.statut()).toBe('en_cours');
  });

  it('met à jour une intervention', () => {
    fixture.detectChanges();
    http.expectOne(r => r.url.endsWith('/interventions/1')).flush({ data: { id: 1, date_heure_debut: '2026-09-24 10:00:00', statut: 'en_cours' } });
    component.compteRendu.set('Nettoyage effectué');
    component.save();
    const req=http.expectOne(r => r.url.endsWith('/interventions/1'));
    expect(req.request.method).toBe('PUT');
    req.flush({ data: { id: 1, statut: 'en_cours', date_heure_debut: '2026-09-24 10:00:00' } });
    expect(component.successMessage()).toBe('Intervention mise à jour.');
  });
});

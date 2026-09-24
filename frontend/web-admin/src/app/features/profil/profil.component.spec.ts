import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { TokenService } from '../../core/auth/token.service';
import { ProfilComponent } from './profil.component';

describe('ProfilComponent', () => {
  let fixture: ComponentFixture<ProfilComponent>;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilComponent],
      providers: [AuthService, TokenService, provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();
    const auth = TestBed.inject(AuthService);
    auth.currentUser.set({
      id: 1, nom: 'Doe', prenom: 'Jane', email: 'jane@example.test', role: 'admin',
      telephone: null, adresse: null
    });
    fixture = TestBed.createComponent(ProfilComponent);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('initialise les champs depuis la session', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.email()).toBe('jane@example.test');
    expect(fixture.componentInstance.prenom()).toBe('Jane');
  });
  it('refuse des mots de passe différents', () => {
    fixture.detectChanges();
    fixture.componentInstance.password.set('a');
    fixture.componentInstance.confirmation.set('b');
    fixture.componentInstance.save();
    expect(fixture.componentInstance.error()).toBe('Les mots de passe ne correspondent pas.');
  });
  it('met à jour le profil', () => {
    fixture.detectChanges();
    fixture.componentInstance.telephone.set('770000000');
    fixture.componentInstance.save();
    const req = http.expectOne(r => r.url.endsWith('/user'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.telephone).toBe('770000000');
    req.flush({
      data: { id: 1, nom: 'Doe', prenom: 'Jane', email: 'jane@example.test', role: 'admin', telephone: '770000000' }
    });
    expect(fixture.componentInstance.success()).toBe('Profil mis à jour.');
  });
});

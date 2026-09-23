import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/models/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let router: Router;

  const mockAdminUser: User = {
    id: 1,
    nom: 'Diallo',
    prenom: 'Admin',
    email: 'admin@isi-ecoreport.sn',
    role: 'admin',
    roles: ['admin']
  };

  const mockAgentUser: User = {
    id: 2,
    nom: 'Sow',
    prenom: 'Agent',
    email: 'agent@isi-ecoreport.sn',
    role: 'agent',
    roles: ['agent']
  };

  const mockCitizenUser: User = {
    id: 3,
    nom: 'Ndiaye',
    prenom: 'Citoyen',
    email: 'citoyen@isi-ecoreport.sn',
    role: 'citizen',
    roles: ['citizen']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'login', component: LoginComponent },
          { path: 'admin/dashboard', children: [] }
        ])
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  // 1. formulaire invalide
  it('should prevent submission when formulaire invalide', () => {
    const loginSpy = vi.spyOn(authService, 'login');

    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');

    component.onSubmit();

    expect(component.loginForm.invalid).toBe(true);
    expect(loginSpy).not.toHaveBeenCalled();
    expect(component.loginForm.controls['email'].touched).toBe(true);
  });

  // 2. email invalide
  it('should validate email invalide format', () => {
    const emailCtrl = component.loginForm.controls['email'];

    emailCtrl.setValue('not-an-email');
    expect(emailCtrl.hasError('email')).toBe(true);

    emailCtrl.setValue('valid@isi-ecoreport.sn');
    expect(emailCtrl.hasError('email')).toBe(false);
  });

  // 3. mot de passe invalide
  it('should validate mot de passe invalide length (< 6)', () => {
    const passCtrl = component.loginForm.controls['password'];

    passCtrl.setValue('12345');
    expect(passCtrl.hasError('minlength')).toBe(true);

    passCtrl.setValue('123456');
    expect(passCtrl.hasError('minlength')).toBe(false);
  });

  // 4. connexion admin
  it('should process connexion admin and navigate to dashboard', () => {
    vi.spyOn(authService, 'login').mockReturnValue(of(mockAdminUser));
    const navSpy = vi.spyOn(router, 'navigateByUrl');

    component.loginForm.setValue({
      email: 'admin@isi-ecoreport.sn',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(navSpy).toHaveBeenCalledWith('/admin/dashboard');
  });

  // 5. connexion avec agent
  it('should reject connexion avec agent and clear session', () => {
    vi.spyOn(authService, 'login').mockReturnValue(of(mockAgentUser));
    const clearSpy = vi.spyOn(authService, 'clearSession');
    const navSpy = vi.spyOn(router, 'navigateByUrl');

    component.loginForm.setValue({
      email: 'agent@isi-ecoreport.sn',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(clearSpy).toHaveBeenCalled();
    expect(navSpy).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('exclusivement réservé aux Administrateurs');
  });

  // 6. connexion avec citizen
  it('should reject connexion avec citizen and clear session', () => {
    vi.spyOn(authService, 'login').mockReturnValue(of(mockCitizenUser));
    const clearSpy = vi.spyOn(authService, 'clearSession');
    const navSpy = vi.spyOn(router, 'navigateByUrl');

    component.loginForm.setValue({
      email: 'citizen@isi-ecoreport.sn',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(clearSpy).toHaveBeenCalled();
    expect(navSpy).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('exclusivement réservé aux Administrateurs');
  });

  // 7. erreur 401
  it('should display error message on 401 Unauthorized', () => {
    const error401 = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Identifiants invalides.' }
    });
    vi.spyOn(authService, 'login').mockReturnValue(throwError(() => error401));

    component.loginForm.setValue({
      email: 'admin@isi-ecoreport.sn',
      password: 'BadPassword'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Identifiants invalides.');
    expect(component.isLoading()).toBe(false);
  });

  // 8. erreur 422
  it('should display validation errors on 422 Unprocessable Entity', () => {
    const error422 = new HttpErrorResponse({
      status: 422,
      statusText: 'Unprocessable Entity',
      error: {
        message: 'Erreur de validation',
        errors: { email: ['Cet email est déjà pris.'] }
      }
    });
    vi.spyOn(authService, 'login').mockReturnValue(throwError(() => error422));

    component.loginForm.setValue({
      email: 'admin@isi-ecoreport.sn',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Erreur de validation');
    expect(component.fieldErrors()['email']).toEqual(['Cet email est déjà pris.']);
    expect(component.isLoading()).toBe(false);
  });

  // 9. API inaccessible (status 0)
  it('should handle API inaccessible (status 0)', () => {
    const error0 = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error'
    });
    vi.spyOn(authService, 'login').mockReturnValue(throwError(() => error0));

    component.loginForm.setValue({
      email: 'admin@isi-ecoreport.sn',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(component.errorMessage()).toContain('Impossible de joindre le serveur API');
    expect(component.isLoading()).toBe(false);
  });
});

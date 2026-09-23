import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  fieldErrors = signal<Record<string, string[]>>({});

  constructor() {
    // Affiche un message si l'utilisateur a été redirigé pour rôle non autorisé
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'forbidden_role') {
        this.errorMessage.set('Accès restreint : le compte connecté ne dispose pas des privilèges Administrateur.');
      } else if (params['error'] === 'unauthorized_role') {
        this.errorMessage.set('Accès non autorisé pour ce profil.');
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.fieldErrors.set({});
    this.isLoading.set(true);

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        // Vérification du rôle admin
        const isAdmin = user.role === 'admin' || (user.roles && user.roles.includes('admin'));
        if (!isAdmin) {
          this.authService.clearSession();
          this.errorMessage.set('Connexion refusée : ce portail est exclusivement réservé aux Administrateurs.');
          return;
        }

        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);

        if (error.status === 422 && error.error?.errors) {
          this.fieldErrors.set(error.error.errors);
          this.errorMessage.set(error.error.message || 'Données fournies non valides.');
        } else if (error.status === 401) {
          this.errorMessage.set(error.error?.message || 'Identifiants invalides (email ou mot de passe incorrect).');
        } else if (error.status === 403) {
          this.errorMessage.set(error.error?.message || 'Accès interdit.');
        } else if (error.status === 0) {
          this.errorMessage.set('Impossible de joindre le serveur API. Vérifiez que le backend Laravel est démarré sur http://127.0.0.1:8000.');
        } else {
          this.errorMessage.set(error.error?.message || 'Une erreur est survenue lors de la tentative de connexion.');
        }
      }
    });
  }
}

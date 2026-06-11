import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  isLoading    = false;
  errorMsg     = '';
  successMsg   = '';
  showPassword = false;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username:  ['', [Validators.required, Validators.minLength(3)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const p1 = form.get('password')?.value;
    const p2 = form.get('password2')?.value;
    return p1 === p2 ? null : { passwordMismatch: true };
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg  = '';

    const { username, email, password } = this.registerForm.value;

    this.http.post(`${environment.apiUrl}/auth/register/`, {
      username, email, password
    }).subscribe({
      next: () => {
        this.isLoading  = false;
        this.successMsg = 'Compte créé avec succès ! Redirection...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.username) {
          this.errorMsg = 'Ce nom d\'utilisateur est déjà pris.';
        } else if (err.error?.email) {
          this.errorMsg = 'Cet email est déjà utilisé.';
        } else {
          this.errorMsg = 'Une erreur est survenue. Réessayez.';
        }
      }
    });
  }
}
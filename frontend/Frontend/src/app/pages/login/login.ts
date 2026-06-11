import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  isLoading = false;
  errorMsg  = '';
  showPassword = false;

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg  = '';

    const { username, password } = this.loginForm.value;

    console.log('Tentative login:', username)

    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        console.log ('Login réussi !');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.log ('Erreur Login', err);
        this.errorMsg  = 'Identifiants incorrects. Veuillez réessayer.';
      }
    });
  }
}
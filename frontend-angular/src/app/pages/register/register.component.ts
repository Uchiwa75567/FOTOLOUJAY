import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  phone = '';
  address = '';
  error = '';
  isLoading = false;

  onSubmit(): void {
    if (!this.username || !this.email || !this.password || !this.phone || !this.address) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    // Validation téléphone sénégalais
    const phoneRegex = /^(77|78|76|70|75)[0-9]{7}$/;
    if (!phoneRegex.test(this.phone)) {
      this.error = 'Numéro de téléphone invalide - doit être un numéro sénégalais de 9 chiffres commençant par 77, 78, 76, 70 ou 75';
      return;
    }

    // Validation adresse
    if (this.address.length < 5) {
      this.error = 'Adresse trop courte (minimum 5 caractères)';
      return;
    }

    this.error = '';
    this.isLoading = true;

    this.authService.register(this.username, this.email, this.password, this.phone, this.address).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de l\'inscription';
        this.isLoading = false;
      }
    });
  }
}

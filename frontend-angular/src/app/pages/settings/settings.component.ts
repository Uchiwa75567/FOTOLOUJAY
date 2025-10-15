import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.profileForm.patchValue({
            email: response.user.email,
            phone: response.user.phone || '',
            address: response.user.address || ''
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Erreur lors du chargement du profil';
        this.loading = false;
      }
    });
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Profil mis à jour avec succès';
            // Update local user data
            this.authService.refreshUserData().subscribe();
          } else {
            this.errorMessage = response.message || 'Erreur lors de la mise à jour du profil';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.errorMessage = 'Erreur lors de la mise à jour du profil';
          this.loading = false;
        }
      });
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const { currentPassword, newPassword } = this.passwordForm.value;

      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Mot de passe changé avec succès';
            this.passwordForm.reset();
          } else {
            this.errorMessage = response.message || 'Erreur lors du changement de mot de passe';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error changing password:', error);
          this.errorMessage = 'Erreur lors du changement de mot de passe';
          this.loading = false;
        }
      });
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      const errors = confirmPassword?.errors;
      if (errors) {
        delete errors['mismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  }

  get profileFormControls() {
    return this.profileForm.controls;
  }

  get passwordFormControls() {
    return this.passwordForm.controls;
  }
}

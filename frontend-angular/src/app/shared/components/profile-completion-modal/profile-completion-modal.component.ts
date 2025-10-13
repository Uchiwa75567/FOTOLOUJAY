import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-completion-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-completion-modal.component.html',
  styleUrls: ['./profile-completion-modal.component.scss']
})
export class ProfileCompletionModalComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  @Output() profileCompleted = new EventEmitter<void>();

  profileForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.profileForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = {
      phone: this.profileForm.value.phone,
      address: this.profileForm.value.address
    };

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.profileCompleted.emit();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage.set(
          error.error?.message || 'Erreur lors de la mise à jour du profil. Veuillez réessayer.'
        );
        this.isSubmitting.set(false);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get phone() {
    return this.profileForm.get('phone');
  }

  get address() {
    return this.profileForm.get('address');
  }
}
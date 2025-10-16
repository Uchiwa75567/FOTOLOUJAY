import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CameraComponent } from '../../shared/components/camera/camera.component';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, CameraComponent],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  productForm: FormGroup;
  capturedPhotos = signal<string[]>([]);
  showCamera = signal(false);
  capturedPhoto = signal<string | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showContactModal = signal(false);

  constructor() {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      price: [0, [Validators.required, Validators.min(0)]],
      condition: ['good', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // No need to pre-fill phone and address as they are removed from the form
  }

  openCamera(): void {
    this.showCamera.set(true);
    this.errorMessage.set(null);
  }

  onPhotoCaptured(photoBase64: string): void {
    this.capturedPhotos.update(photos => [...photos, photoBase64]);
    this.showCamera.set(false);
  }

  onCameraCancelled(): void {
    this.showCamera.set(false);
  }

  removePhoto(index: number): void {
    this.capturedPhotos.update(photos => photos.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    if (this.capturedPhotos().length === 0) {
      this.errorMessage.set('Veuillez capturer au moins une photo de votre produit');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = {
      title: this.productForm.value.title,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      photos: this.capturedPhotos()
    };

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.successMessage.set('✅ Produit créé avec succès ! En attente de validation par un modérateur.');
        this.isSubmitting.set(false);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.errorMessage.set(
          error.error?.message || 'Erreur lors de la création du produit. Veuillez réessayer.'
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

  get title() {
    return this.productForm.get('title');
  }

  get description() {
    return this.productForm.get('description');
  }

  get price() {
    return this.productForm.get('price');
  }

  get condition() {
    return this.productForm.get('condition');
  }
}

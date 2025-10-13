import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnDestroy, AfterViewInit {
  @ViewChild('video', { static: false }) videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasElement?: ElementRef<HTMLCanvasElement>;
  @Output() photoCaptured = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  isCameraActive = signal(false);
  capturedPhoto = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  isInitializing = signal(false);
  private stream: MediaStream | null = null;

  ngAfterViewInit(): void {
    // Component is ready, ViewChild elements are available
  }

  async startCamera(): Promise<void> {
    try {
      this.errorMessage.set(null);
      this.isInitializing.set(true);
      
      console.log('Requesting camera access...');
      
      // Request camera access (prefer back camera on mobile)
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      console.log('Camera access granted, stream:', this.stream);
      
      // Set camera as active first to render the video element
      this.isCameraActive.set(true);
      this.isInitializing.set(false);

      // Wait for Angular to render the video element
      setTimeout(() => {
        if (this.videoElement && this.stream) {
          console.log('Setting video srcObject');
          const video = this.videoElement.nativeElement;
          video.srcObject = this.stream;
          video.play().catch(err => {
            console.error('Error playing video:', err);
            this.errorMessage.set('Erreur lors du démarrage de la vidéo');
          });
        } else {
          console.error('Video element not found after timeout');
          this.errorMessage.set('Erreur: Élément vidéo non trouvé');
        }
      }, 200);
    } catch (error: any) {
      console.error('Camera access error:', error);
      this.isInitializing.set(false);
      
      if (error.name === 'NotAllowedError') {
        this.errorMessage.set('Permission caméra refusée. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.');
      } else if (error.name === 'NotFoundError') {
        this.errorMessage.set('Aucune caméra trouvée sur cet appareil.');
      } else if (error.name === 'NotReadableError') {
        this.errorMessage.set('La caméra est déjà utilisée par une autre application.');
      } else if (error.name === 'OverconstrainedError') {
        // Fallback: try with any camera if back camera not available
        console.log('Back camera not available, trying any camera...');
        this.tryFallbackCamera();
      } else {
        this.errorMessage.set(`Erreur d'accès à la caméra: ${error.message || 'Veuillez réessayer.'}`);
      }
    }
  }

  private async tryFallbackCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      this.isCameraActive.set(true);
      this.isInitializing.set(false);

      setTimeout(() => {
        if (this.videoElement && this.stream) {
          const video = this.videoElement.nativeElement;
          video.srcObject = this.stream;
          video.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
      }, 200);
    } catch (error: any) {
      console.error('Fallback camera error:', error);
      this.errorMessage.set('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      this.isInitializing.set(false);
    }
  }

  capturePhoto(): void {
    if (!this.videoElement || !this.canvasElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    
    this.capturedPhoto.set(base64Image);
    this.stopCamera();
  }

  retakePhoto(): void {
    this.capturedPhoto.set(null);
    this.startCamera();
  }

  confirmPhoto(): void {
    const photo = this.capturedPhoto();
    if (photo) {
      this.photoCaptured.emit(photo);
    }
  }

  cancel(): void {
    this.stopCamera();
    this.cancelled.emit();
  }

  private stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraActive.set(false);
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
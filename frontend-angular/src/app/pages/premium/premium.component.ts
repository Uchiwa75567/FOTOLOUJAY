import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PremiumService, type PremiumPack, type PremiumStatus } from '../../core/services/premium.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {
  private premiumService = inject(PremiumService);
  private authService = inject(AuthService);
  private router = inject(Router);

  packs = signal<PremiumPack[]>([]);
  premiumStatus = signal<PremiumStatus | null>(null);
  isLoadingPacks = signal(true);
  isLoadingStatus = signal(true);
  errorMessage = signal<string | null>(null);
  purchasingPackId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPacks();
    this.loadPremiumStatus();
  }

  private loadPacks(): void {
    this.isLoadingPacks.set(true);
    this.premiumService.getPacks().subscribe({
      next: (response) => {
        this.packs.set(response.packs);
        this.isLoadingPacks.set(false);
      },
      error: (error) => {
        console.error('Error loading packs:', error);
        this.errorMessage.set('Erreur lors du chargement des packs premium');
        this.isLoadingPacks.set(false);
      }
    });
  }

  private loadPremiumStatus(): void {
    this.isLoadingStatus.set(true);
    this.premiumService.getPremiumStatus().subscribe({
      next: (status) => {
        this.premiumStatus.set(status);
        this.isLoadingStatus.set(false);
      },
      error: (error) => {
        console.error('Error loading premium status:', error);
        this.isLoadingStatus.set(false);
      }
    });
  }

  purchasePack(packId: string): void {
    this.purchasingPackId.set(packId);
    this.errorMessage.set(null);

    this.premiumService.purchasePack(packId).subscribe({
      next: (response) => {
        if (response.success && response.paymentUrl) {
          // Redirect to PayTech payment page
          window.location.href = response.paymentUrl;
        } else {
          this.errorMessage.set('Erreur lors de l\'initiation du paiement');
          this.purchasingPackId.set(null);
        }
      },
      error: (error) => {
        console.error('Error purchasing pack:', error);
        this.errorMessage.set(
          error.error?.message || 'Erreur lors de l\'achat du pack. Veuillez réessayer.'
        );
        this.purchasingPackId.set(null);
      }
    });
  }

  getPackFeatures(packName: string): string[] {
    const features: Record<string, string[]> = {
      'Basic': [
        '✨ Badge Premium sur votre profil',
        '🎯 Affichage prioritaire de vos produits',
        '📊 Statistiques de base',
        '💬 Support par email'
      ],
      'Pro': [
        '✨ Badge Premium VIP sur votre profil',
        '🎯 Affichage prioritaire maximum',
        '📊 Statistiques avancées détaillées',
        '📸 Upload multiple de photos (jusqu\'à 5)',
        '💬 Support prioritaire 24/7',
        '🎨 Personnalisation du profil'
      ],
      'Enterprise': [
        '✨ Badge Premium Elite sur votre profil',
        '🎯 Affichage en tête de liste garanti',
        '📊 Statistiques complètes et analytics',
        '📸 Upload illimité de photos',
        '💬 Support dédié avec manager',
        '🎨 Personnalisation avancée',
        '🚀 Fonctionnalités exclusives',
        '📈 Outils marketing avancés'
      ]
    };

    return features[packName] || [
      '✨ Badge Premium',
      '🎯 Affichage prioritaire',
      '📊 Statistiques',
      '💬 Support'
    ];
  }

  isPopularPack(packName: string): boolean {
    return packName === 'Pro';
  }

  formatDuration(duration: number, unit: string): string {
    if (unit === 'MONTH' || unit === 'month') {
      return duration === 1 ? '1 mois' : `${duration} mois`;
    }
    if (unit === 'YEAR' || unit === 'year') {
      return duration === 1 ? '1 an' : `${duration} ans`;
    }
    return `${duration} ${unit}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  }

  getDaysRemainingText(): string {
    const status = this.premiumStatus();
    if (!status || !status.isPremium) return '';
    
    const days = status.daysRemaining;
    if (days === 0) return 'Expire aujourd\'hui';
    if (days === 1) return 'Expire demain';
    return `${days} jours restants`;
  }
}
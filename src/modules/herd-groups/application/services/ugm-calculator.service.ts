import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client/runtime/client';

/**
 * Service responsible for calculating UGM (Unidad Ganadera Mayor)
 * based on live weight in kilograms.
 *
 * UGM is a standardized unit used in livestock management in South America,
 * particularly in PRV (Pinheiro Machado, RS).
 *
 * Default: 1 UGM = 450 kg live weight
 */
@Injectable()
export class UgmCalculatorService {
  private readonly ugmKgEquivalence: number;

  constructor(private configService: ConfigService) {
    // Get UGM equivalence from env or use default (450 kg)
    this.ugmKgEquivalence = this.configService.get<number>(
      'UGM_KG_EQUIVALENCE',
      450,
    );
  }

  /**
   * Calculate UGM from live weight in kg
   * Formula: UGM = liveWeightKg / UGM_KG_EQUIVALENCE
   *
   * @param liveWeightKg - Total live weight in kilograms
   * @returns Calculated UGM value
   */
  calculateUgm(liveWeightKg: number | Decimal): Decimal {
    const weight =
      typeof liveWeightKg === 'number' ? liveWeightKg : liveWeightKg.toNumber();

    if (weight < 0) {
      throw new Error('Live weight cannot be negative');
    }

    const ugmValue = weight / this.ugmKgEquivalence;

    // Return as Decimal with 4 decimal places precision
    return new Decimal(ugmValue.toFixed(4));
  }

  /**
   * Get the current UGM kg equivalence being used
   * @returns The kg equivalence value (default 450)
   */
  getUgmKgEquivalence(): number {
    return this.ugmKgEquivalence;
  }
}

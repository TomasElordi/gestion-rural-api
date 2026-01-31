import { Injectable, ConflictException } from '@nestjs/common';
import { GrazingEventRepository } from '../../domain/repositories/grazing-event.repository';
import { GrazingEventStatus } from '../../presentation/dto/update-grazing-event.dto';

@Injectable()
export class GrazingEventRulesService {
  constructor(private grazingEventRepository: GrazingEventRepository) {}

  /**
   * Determine the initial status based on start and end dates
   * - If startAt is in the future -> planned
   * - If startAt is now/past and endAt is null -> active
   * - If endAt is provided -> done
   */
  determineInitialStatus(startAt: string, endAt?: string): GrazingEventStatus {
    const startDate = new Date(startAt);
    const now = new Date();

    // If end date is provided, event is done
    if (endAt) {
      return GrazingEventStatus.DONE;
    }

    // If start date is in the future, event is planned
    if (startDate > now) {
      return GrazingEventStatus.PLANNED;
    }

    // Otherwise, event is active
    return GrazingEventStatus.ACTIVE;
  }

  /**
   * Validate that a herd group doesn't have multiple active events
   * Throws ConflictException if validation fails
   */
  async validateHerdGroupAvailability(
    herdGroupId: string,
    excludeEventId?: string,
  ): Promise<void> {
    const activeEvents =
      await this.grazingEventRepository.findActiveByHerdGroupId(
        herdGroupId,
        excludeEventId,
      );

    if (activeEvents.length > 0) {
      throw new ConflictException(
        `Herd group is already in an active grazing event (ID: ${activeEvents[0].id})`,
      );
    }
  }

  /**
   * Validate that a paddock doesn't have multiple active events
   * Throws ConflictException if validation fails
   */
  async validatePaddockAvailability(
    paddockId: string,
    excludeEventId?: string,
  ): Promise<void> {
    const activeEvents =
      await this.grazingEventRepository.findActiveByPaddockId(
        paddockId,
        excludeEventId,
      );

    if (activeEvents.length > 0) {
      throw new ConflictException(
        `Paddock is already in use by another active grazing event (ID: ${activeEvents[0].id})`,
      );
    }
  }

  /**
   * Validate that when updating to active status, resources are available
   */
  async validateActivation(
    eventId: string,
    herdGroupId: string,
    paddockId: string,
  ): Promise<void> {
    await this.validateHerdGroupAvailability(herdGroupId, eventId);
    await this.validatePaddockAvailability(paddockId, eventId);
  }

  /**
   * Validate date consistency
   */
  validateDateConsistency(startAt: Date, endAt?: Date): void {
    if (endAt && startAt >= endAt) {
      throw new ConflictException('End date must be after start date');
    }
  }
}

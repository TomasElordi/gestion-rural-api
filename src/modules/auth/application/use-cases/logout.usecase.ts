import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string) {
    await this.users.setRefreshTokenHash(userId, null);
    return { ok: true };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';

@Injectable()
export class RefreshTokenCleanupService {
  private readonly logger = new Logger(RefreshTokenCleanupService.name);
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  ///importamos cron para tareas automatizadas cada cierto tiempo, es equivalente a un @scheduled de spring
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const deleted =
      await this.refreshTokenRepository.deleteRevokedOrExpiredRefreshTokens(); ///llamamos al metodo que elimina los tokens revocados o expirados
    this.logger.log(`tokens revocados/expirados eliminados: ${deleted}`); /// mostramos cuantos tokens fueron eliminados
  }
}

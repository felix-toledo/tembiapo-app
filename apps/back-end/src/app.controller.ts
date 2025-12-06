import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

export const API_PREFIX = 'api/v1';

@Controller(API_PREFIX)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getDbHealth(): Promise<{ total: number }> {
    return this.appService.getDbHealth();
  }
}

// src/doses/doses.controller.ts
import { Controller, Post, Param, Body } from '@nestjs/common';
import { DosesService } from './doses.service';

@Controller('doses')
export class DosesController {
  constructor(private svc: DosesService) {}

  @Post(':id/confirm')
  async confirm(@Param('id') id: string, @Body() body: { deviceId?: string; confirmedAt?: string }) {
    const by = body.deviceId || 'unknown';
    return this.svc.confirm(id, by, body.confirmedAt);
  }

  @Post(':id/miss')
  async markMissed(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.svc.markMissed(id, body.reason);
  }
}

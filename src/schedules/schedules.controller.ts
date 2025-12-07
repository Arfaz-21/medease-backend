import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('patients/:patientId/schedules')
export class SchedulesController {
  constructor(private svc: SchedulesService) {}

  @Post()
  async create(@Param('patientId') patientId: string, @Body() dto: any) {
    return this.svc.create(patientId, dto);
  }

  @Get()
  async list(@Param('patientId') patientId: string) {
    return this.svc.findByPatient(patientId);
  }
}

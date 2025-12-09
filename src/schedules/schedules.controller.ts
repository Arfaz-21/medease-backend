// src/schedules/schedules.controller.ts
import { Controller, Post, Body, Param, Get, Delete, Patch } from '@nestjs/common';
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

  @Patch(':id')
  async update(@Param('patientId') patientId: string, @Param('id') id: string, @Body() dto: any) {
    return this.svc.update(patientId, id, dto);
  }

  @Delete(':id')
  async remove(@Param('patientId') patientId: string, @Param('id') id: string) {
    return this.svc.remove(patientId, id);
  }
}

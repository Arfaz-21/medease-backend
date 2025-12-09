// src/medications/medications.controller.ts
import { Controller, Post, Body, Param, Get, Delete, Patch } from '@nestjs/common';
import { MedicationsService } from './medications.service';

@Controller('patients/:patientId/medications')
export class MedicationsController {
  constructor(private svc: MedicationsService) {}

  @Post()
  async create(@Param('patientId') patientId: string, @Body() dto: any) {
    return this.svc.create(patientId, dto);
  }

  @Get()
  async list(@Param('patientId') patientId: string) {
    return this.svc.findByPatient(patientId);
  }

  @Patch(':medId')
  async update(@Param('patientId') patientId: string, @Param('medId') medId: string, @Body() dto: any) {
    return this.svc.update(patientId, medId, dto);
  }

  @Delete(':medId')
  async remove(@Param('patientId') patientId: string, @Param('medId') medId: string) {
    return this.svc.remove(patientId, medId);
  }
}

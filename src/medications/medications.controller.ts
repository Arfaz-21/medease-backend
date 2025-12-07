import { Controller, Post, Body, Param } from '@nestjs/common';
import { MedicationsService } from './medications.service';

@Controller('patients/:patientId/medications')
export class MedicationsController {
  constructor(private svc: MedicationsService) {}

  @Post()
  async create(@Param('patientId') patientId: string, @Body() dto: any) {
    return this.svc.create(patientId, dto);
  }
}

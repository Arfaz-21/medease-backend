import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private svc: PatientsService) {}

  @Post()
  async create(@Body() dto: { name: string; timezone?: string; caregiverId?: string }) {
    return this.svc.create(dto);
  }

  @Get()
  async list() {
    return this.svc.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}

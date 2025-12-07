// src/patients/patients.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PatientsService {
  private prisma = new PrismaClient();

  async create(dto: { name: string; timezone?: string; caregiverId?: string }) {
    return this.prisma.patient.create({
      data: {
        name: dto.name,
        timezone: dto.timezone || 'UTC',
        caregiverId: dto.caregiverId || null,
      },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany();
  }

  async findOne(id: string) {
    return this.prisma.patient.findUnique({ where: { id } });
  }
}

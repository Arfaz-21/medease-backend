import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MedicationsService {
  private prisma = new PrismaClient();

  async create(patientId: string, dto: any) {
    return this.prisma.medication.create({
      data: {
        patientId,
        name: dto.name,
        dosage: dto.dosage || '',
        notes: dto.notes || '',
        icon: dto.icon || '💊',
      },
    });
  }
}

// src/medications/medications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MedicationsService {
  private prisma = new PrismaClient();

  async create(patientId: string, dto: any) {
    // expected dto: { name, dosage, icon?, notes? }
    const med = await this.prisma.medication.create({
      data: {
        patientId,
        name: dto.name,
        dosage: dto.dosage || '',
        icon: dto.icon || '',
        notes: dto.notes || '',
      },
    });
    return med;
  }

  async findByPatient(patientId: string) {
    return this.prisma.medication.findMany({ where: { patientId } });
  }

  async update(patientId: string, medId: string, dto: any) {
    const med = await this.prisma.medication.findUnique({ where: { id: medId } });
    if (!med || med.patientId !== patientId) throw new NotFoundException('Medication not found');
    return this.prisma.medication.update({ where: { id: medId }, data: dto });
  }

  async remove(patientId: string, medId: string) {
    const med = await this.prisma.medication.findUnique({ where: { id: medId } });
    if (!med || med.patientId !== patientId) throw new NotFoundException('Medication not found');
    return this.prisma.medication.delete({ where: { id: medId } });
  }
}

// src/doses/doses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DosesService {
  private prisma = new PrismaClient();

  // Confirm dose taken
  async confirm(doseId: string, confirmedBy = 'unknown', confirmedAt?: string) {
    const dose = await this.prisma.doseRecord.findUnique({ where: { id: doseId }});
    if (!dose) throw new NotFoundException('Dose not found');

    return this.prisma.doseRecord.update({
      where: { id: doseId },
      data: {
        status: 'TAKEN',
        confirmedAt: confirmedAt ? new Date(confirmedAt) : new Date(),
        confirmedBy,
      },
    });
  }

  // Mark dose missed
  async markMissed(doseId: string, reason?: string) {
    const dose = await this.prisma.doseRecord.findUnique({ where: { id: doseId }});
    if (!dose) throw new NotFoundException('Dose not found');

    return this.prisma.doseRecord.update({
      where: { id: doseId },
      data: {
        status: 'MISSED',
        confirmedAt: new Date(),
      },
    });
  }
}

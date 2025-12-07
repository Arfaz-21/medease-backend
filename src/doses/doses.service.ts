import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DosesService {
  private prisma = new PrismaClient();

  async confirm(doseId: string, confirmedBy: string, confirmedAt?: string) {
    return this.prisma.doseRecord.update({
      where: { id: doseId },
      data: {
        status: 'TAKEN',
        confirmedBy,
        confirmedAt: confirmedAt ? new Date(confirmedAt) : new Date(),
      },
    });
  }
}

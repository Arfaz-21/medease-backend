// src/schedules/schedules.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SchedulesService {
  private prisma = new PrismaClient();

  async create(patientId: string, dto: any) {
    return this.prisma.schedule.create({
      data: {
        patientId,
        medicationId: dto.medicationId,
        timeOfDay: dto.timeOfDay,
        recurrence: dto.recurrence || 'daily',
        windowMins: dto.windowMins ?? 30,
      },
    });
  }

  async findByPatient(patientId: string) {
    return this.prisma.schedule.findMany({ where: { patientId } });
  }
}

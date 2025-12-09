// src/schedules/schedules.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SchedulesService {
  private prisma = new PrismaClient();

  async create(patientId: string, dto: any) {
    // dto: { medicationId, timeOfDay: "HH:mm", recurrence? ("daily" or rrule), windowMins? }
    return this.prisma.schedule.create({
      data: {
        patientId,
        medicationId: dto.medicationId,
        timeOfDay: dto.timeOfDay,
        recurrence: dto.recurrence || 'daily',
        windowMins: dto.windowMins ?? 30,
        active: dto.active ?? true,
      },
    });
  }

  async findByPatient(patientId: string) {
    return this.prisma.schedule.findMany({ where: { patientId }, include: { medication: true } });
  }

  async update(patientId: string, id: string, dto: any) {
    const s = await this.prisma.schedule.findUnique({ where: { id } });
    if (!s || s.patientId !== patientId) throw new NotFoundException('Schedule not found');
    return this.prisma.schedule.update({ where: { id }, data: dto });
  }

  async remove(patientId: string, id: string) {
    const s = await this.prisma.schedule.findUnique({ where: { id } });
    if (!s || s.patientId !== patientId) throw new NotFoundException('Schedule not found');
    return this.prisma.schedule.delete({ where: { id } });
  }
}

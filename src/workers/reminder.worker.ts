// workers/reminder.worker.ts
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { RRule } from 'rrule';
import { DateTime } from 'luxon';

const connection = new IORedis(process.env.REDIS_URL);
const prisma = new PrismaClient();
const reminderQueue = new Queue('reminders', { connection });

async function producePending() {
  const schedules = await prisma.schedule.findMany({
    where: { active: true },
    include: { patient: true }
  });

  const nowUtc = DateTime.utc();

  for (const s of schedules) {
    const tz = s.patient?.timezone || 'UTC';

    if (s.recurrence === 'daily') {
      const [hour, minute] = s.timeOfDay.split(':').map(Number);
      let candidate = DateTime.now().setZone(tz).set({ hour, minute, second: 0, millisecond: 0 });

      if (candidate <= DateTime.now().setZone(tz)) candidate = candidate.plus({ days: 1 });
      const scheduledAt = candidate.toUTC().toJSDate();

      const exists = await prisma.doseRecord.findFirst({
        where: { scheduleId: s.id, scheduledAt }
      });

      if (!exists) {
        const dose = await prisma.doseRecord.create({
          data: {
            scheduleId: s.id,
            patientId: s.patientId,
            scheduledAt,
            status: 'PENDING'
          }
        });
        await reminderQueue.add('send-reminder', { doseId: dose.id });
      }
    } else {
      // RRULE
      try {
        const rule = RRule.fromString(s.recurrence);
        const next = rule.after(new Date(), true);
        if (next) {
          const scheduledAt = DateTime.fromJSDate(next).toUTC().toJSDate();
          const exists = await prisma.doseRecord.findFirst({
            where: { scheduleId: s.id, scheduledAt }
          });
          if (!exists && scheduledAt > new Date()) {
            const dose = await prisma.doseRecord.create({
              data: {
                scheduleId: s.id,
                patientId: s.patientId,
                scheduledAt,
                status: 'PENDING'
              }
            });
            await reminderQueue.add('send-reminder', { doseId: dose.id });
          }
        }
      } catch (e) {
        console.warn('Invalid recurrence', s.id, e?.message);
      }
    }
  }
}

new Worker('reminders', async (job: Job) => {
  if (job.name === 'send-reminder') {
    const { doseId } = job.data;
    const dose = await prisma.doseRecord.findUnique({
      where: { id: doseId },
      include: { schedule: { include: { patient: true, medication: true } } }
    });
    if (!dose) return;
    const med = dose.schedule.medication;
    const patient = dose.schedule.patient;
    console.log(`Reminder: dose ${doseId} for patient ${patient.id} at ${dose.scheduledAt}`);
    // build Kannada message
    const knMsg = `ನಿಮ್ಮ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯವಾಗಿದೆ. ಔಷಧಿ: ${med?.name || 'ಔಷಧಿ'}.`;
    // Placeholder - integrate with FCM/Email/SMS/Push here
    // e.g., notificationsService.pushToDevice(token, "MedEase Reminder", knMsg, { doseId })
  }
}, { connection });

(async () => {
  // scheduled producer: every minute produce new pending doseRecords
  await reminderQueue.add('produce', {}, { repeat: { cron: '* * * * *' } });
  console.log('Reminder worker started');
  await producePending();
})();

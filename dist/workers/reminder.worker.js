"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path_1 = require("path");
dotenv.config({
    path: (0, path_1.join)(__dirname, '..', '..', '.env')
});
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const client_1 = require("@prisma/client");
const rrule_1 = require("rrule");
const luxon_1 = require("luxon");
const connection = new ioredis_1.default(process.env.REDIS_URL);
const prisma = new client_1.PrismaClient();
const reminderQueue = new bullmq_1.Queue('reminders', { connection });
async function producePending() {
    const schedules = await prisma.schedule.findMany({
        where: { active: true },
        include: { patient: true }
    });
    for (const s of schedules) {
        const tz = s.patient?.timezone || 'UTC';
        if (s.recurrence === 'daily') {
            const [hour, minute] = s.timeOfDay.split(':').map(Number);
            let candidate = luxon_1.DateTime.now()
                .setZone(tz)
                .set({ hour, minute, second: 0, millisecond: 0 });
            if (candidate < luxon_1.DateTime.now().setZone(tz)) {
                candidate = candidate.plus({ days: 1 });
            }
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
        }
        else {
            try {
                const rule = rrule_1.RRule.fromString(s.recurrence);
                const next = rule.after(new Date(), true);
                if (next) {
                    const scheduledAt = luxon_1.DateTime.fromJSDate(next).toUTC().toJSDate();
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
            }
            catch (e) {
                console.warn('Invalid recurrence', s.id);
            }
        }
    }
}
new bullmq_1.Worker('reminders', async (job) => {
    if (job.name === 'send-reminder') {
        const { doseId } = job.data;
        const dose = await prisma.doseRecord.findUnique({
            where: { id: doseId },
            include: { schedule: { include: { patient: true } } }
        });
        if (!dose)
            return;
        console.log(`Reminder: dose ${doseId} for patient ${dose.schedule.patientId} at ${dose.scheduledAt}`);
    }
}, { connection });
(async () => {
    await reminderQueue.add('produce', {}, { repeat: { cron: '* * * * *' } });
    console.log('Reminder worker started');
    await producePending();
})();
//# sourceMappingURL=reminder.worker.js.map
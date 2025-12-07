import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
const prisma = new PrismaClient();

@Injectable()
export class NotificationsService {
  async notifyCaregiver(patientId: string, message: string) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId }, include: { caregiver: true }});
    if (patient?.caregiver?.email) {
      console.log(`(placeholder) Notify caregiver ${patient.caregiver.email}: ${message}`);
      // integrate Twilio or email provider here
    }
  }

  async pushToDevice(token: string, title: string, body: string, data = {}) {
    const key = process.env.FCM_SERVER_KEY;
    if (!key) {
      console.log('FCM key missing; skipping push');
      return;
    }
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: { Authorization: `key=${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: token, notification: { title, body }, data })
    });
  }
}

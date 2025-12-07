"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const node_fetch_1 = require("node-fetch");
const prisma = new client_1.PrismaClient();
let NotificationsService = class NotificationsService {
    async notifyCaregiver(patientId, message) {
        const patient = await prisma.patient.findUnique({ where: { id: patientId }, include: { caregiver: true } });
        if (patient?.caregiver?.email) {
            console.log(`(placeholder) Notify caregiver ${patient.caregiver.email}: ${message}`);
        }
    }
    async pushToDevice(token, title, body, data = {}) {
        const key = process.env.FCM_SERVER_KEY;
        if (!key) {
            console.log('FCM key missing; skipping push');
            return;
        }
        await (0, node_fetch_1.default)('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: { Authorization: `key=${key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: token, notification: { title, body }, data })
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
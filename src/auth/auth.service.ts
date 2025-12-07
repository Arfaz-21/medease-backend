import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  async validateCaregiver(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password || '');
    return isValid ? user : null;
  }

  login(user: any) {
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return { token, user };
  }

  async deviceLogin(deviceId: string) {
    const device = await this.prisma.device.findUnique({ where: { id: deviceId } });
    if (!device) return null;

    const token = jwt.sign(
      { sub: deviceId, role: 'PATIENT_DEVICE' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return { token, deviceId };
  }
}

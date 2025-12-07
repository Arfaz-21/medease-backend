import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  // Actual caregiver login
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.svc.validateCaregiver(body.email, body.password);
    if (!user) return { error: 'Invalid' };
    return this.svc.login(user);
  }

  // Device login
  @Post('device-login')
  async deviceLogin(@Body() body: { deviceId: string }) {
    const t = await this.svc.deviceLogin(body.deviceId);
    if (!t) return { error: 'Invalid device' };
    return t;
  }

  // Register route placeholder (optional)
  @Post('register')
  register(@Body() dto: any) {
    return { message: 'User registered' };
  }

  // Test route
  @Get('test')
  test() {
    return { message: 'Auth works' };
  }
}

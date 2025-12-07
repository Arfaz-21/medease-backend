import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { MedicationsModule } from './medications/medications.module';
import { SchedulesModule } from './schedules/schedules.module';
import { DosesModule } from './doses/doses.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AuthModule,
    PatientsModule,
    MedicationsModule,
    SchedulesModule,
    DosesModule,
    NotificationsModule,
  ],
})
export class AppModule {}

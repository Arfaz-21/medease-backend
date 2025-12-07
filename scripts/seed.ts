import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function seed() {
  const pw = await bcrypt.hash('password123', 10);
  const caregiver = await prisma.user.upsert({
    where: { email: 'caregiver@example.com' },
    update: {},
    create: { name: 'Caregiver One', email: 'caregiver@example.com', password: pw, role: 'CAREGIVER' }
  });
  const patient = await prisma.patient.upsert({
    where: { name: 'Mr. Elder' },
    update: {},
    create: { name: 'Mr. Elder', timezone: 'Asia/Kolkata', caregiverId: caregiver.id }
  });
  console.log({ caregiver: { id: caregiver.id, email: caregiver.email }, patient: { id: patient.id } });
  process.exit(0);
}
seed();

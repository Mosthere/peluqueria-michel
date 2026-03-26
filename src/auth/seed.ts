import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const existing = await userRepository.findOne({
    where: { email: 'admin@peluqueria.com' },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepository.save({
      email: 'admin@peluqueria.com',
      password: hashedPassword,
      name: 'Michel',
    });
    console.log('✅ Usuario admin creado');
  } else {
    console.log('ℹ️  El usuario admin ya existe');
  }

  await app.close();
}

seed();
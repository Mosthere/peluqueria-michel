import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { User } from './user.entity';
import { StringValue } from 'ms';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  exports: [JwtGuard, JwtModule],
})
export class AuthModule {}
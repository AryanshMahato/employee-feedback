import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    JwtModule.register({
      secret: EnvConfig.jwtSecret,
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

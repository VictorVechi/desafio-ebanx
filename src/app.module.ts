import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventModule } from './events/event.module';
import { PrismaService } from './database/prisma.service';
import { AccountRepository } from './account/domain/repository/account-repository';
import { PrismaAccountRepository } from './account/infrastructure/repository/prisma-account-repository';
import { EventController } from './events/infrastructure/controller/event.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    EventController
  ],
  providers: [
    PrismaService,
    {
      provide: AccountRepository,
      useClass: PrismaAccountRepository
    }

  ],
})
export class AppModule {}

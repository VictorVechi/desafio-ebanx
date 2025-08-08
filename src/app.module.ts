import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AccountRepository } from './account/domain/repository/account-repository';
import { PrismaAccountRepository } from './account/infra/repository/prisma-account-repository';
import { EventController } from './events/infra/controller/event.controller';
import { AccountService } from './account/application/account.service';
import { EventContextService } from './events/application/event-context.service';
import { EventContextInterface } from './events/domain/application/event-context-interface';
import { DepositServiceStrategy } from './events/application/strategies/deposit.service';
import { TransferServiceStrategy } from './events/application/strategies/transfer.service';
import { WithdrawServiceStrategy } from './events/application/strategies/withdraw.service';
import { AccountController } from './account/infra/controller/account.controller';

@Module({
    imports: [],
    controllers: [
        EventController,
        AccountController,
    ],
    providers: [
        PrismaService,
        AccountService,
        WithdrawServiceStrategy,
        TransferServiceStrategy,
        DepositServiceStrategy,
        {
            provide: EventContextInterface,
            useClass: EventContextService
        },
        {
            provide: AccountRepository,
            useClass: PrismaAccountRepository
        }
    ],
})
export class AppModule { }

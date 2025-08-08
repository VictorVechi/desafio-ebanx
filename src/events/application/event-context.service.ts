import { Injectable } from '@nestjs/common';
import { EventDto } from '../domain/dto/event.dto';
import { EventContextInterface } from '../domain/application/event-context-interface';
import { DepositServiceStrategy } from './strategies/deposit.service';
import { TransferServiceStrategy } from './strategies/transfer.service';
import { WithdrawServiceStrategy } from './strategies/withdraw.service';
import { EventType } from '../domain/enum/event-enum';
import { EventResponseDto } from '../domain/dto/event-response.dto';


@Injectable()
export class EventContextService implements EventContextInterface {
    constructor(
        private readonly depositService: DepositServiceStrategy,
        private readonly transferService: TransferServiceStrategy,
        private readonly withdrawService: WithdrawServiceStrategy,
    ) {}

    async processEvent(event: EventDto): Promise<EventResponseDto> {
        switch (event.type.toLowerCase()) {
            case EventType.DEPOSIT:
                return await this.depositService.executeTransaction(event);
            case EventType.TRANSFER:
                return await this.transferService.executeTransaction(event);
            case EventType.WITHDRAW:
                return await this.withdrawService.executeTransaction(event);
            default:
                throw new Error(`Unknown event type: ${event.type}`);
        }
    }
}

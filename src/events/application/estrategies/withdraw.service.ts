import { Injectable } from "@nestjs/common";
import { Account } from "@prisma/client";
import { AccountService } from "src/account/application/account.service";
import { AccountModel } from "src/account/domain/entity/account.entity";
import { EventStrategy } from "src/events/domain/application/event-strategy";
import { EventDto } from "src/events/domain/dto/event.dto";
import { WithdrawResponseDto } from "src/events/domain/dto/withdraw-response.dto";


@Injectable()
export class WithdrawServiceStrategy implements EventStrategy {
    constructor(private readonly accountService: AccountService) {}
    async executeTransaction(event: EventDto): Promise<WithdrawResponseDto | null> {
        const withdrawData = this.validateEvent(event);
        if (!withdrawData) {
            throw new Error("Invalid withdraw event data");
        }
        
        const account = await this.accountService.findAccountById(withdrawData.id);
        if (!account) {
            return null;
        }

        const updatedBalance = this.handleFluctuation(withdrawData, account);

        const updatedAccount = {
            ...account,
            balance: updatedBalance,
            updatedAt: new Date(),
        };
        
        const savedAccount = await this.accountService.saveAccount(updatedAccount);

        return this.toJson(savedAccount);
    }

    private validateEvent(event: EventDto): AccountModel | null {
        if (!event.origin || event.amount <= 0) {
            return null;
        }

        return {
            id: event.origin,
            balance: event.amount,
        };
    }

    private handleFluctuation(event: AccountModel, account: Account): number {
        if (account.balance.toNumber() < event.balance) {
            throw new Error("Insufficient funds for withdrawal");
        }

        return ((account.balance.toNumber() * 1000) - (event.balance * 1000)) / 1000;
    }

    private toJson(account: Account): WithdrawResponseDto {
        return {
            origin: {
                id: account.id,
                balance: account.balance.toNumber(),
            }
        };
    }
}
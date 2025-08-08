import { Injectable } from "@nestjs/common";
import { Account } from "@prisma/client";
import { AccountService } from "src/account/application/account.service";
import { AccountModel } from "src/account/domain/entity/account.entity";
import { EventStrategy } from "src/events/domain/application/event-strategy";
import { DepositResponseDto } from "src/events/domain/dto/deposit-response.dto";
import { EventDto } from "src/events/domain/dto/event.dto";


@Injectable()
export class DepositServiceStrategy implements EventStrategy {
    constructor(private readonly accountService: AccountService) {}
    async executeTransaction(event: EventDto): Promise<DepositResponseDto> {

        const depositData = this.validateEvent(event);

        const account = await this.accountService.findAccountById(depositData.id);

        if (!account) {
            const newAccount = await this.accountService.saveAccount(depositData);
            return this.toJson(newAccount);
        }

        const updatedBalance = this.handleFluctuation(depositData, account);

        const updatedAccount = {
            ...account,
            balance: updatedBalance,
            updatedAt: new Date(),
        };

        const savedAccount = await this.accountService.saveAccount(updatedAccount);

        return this.toJson(savedAccount);
    }

    private validateEvent(event: EventDto): AccountModel {
        if (!event.destination || !event.amount) {
            throw new Error("Invalid deposit event data");
        }

        return {
            id: event.destination,
            balance: event.amount,
        }
    }

    private handleFluctuation(event: AccountModel, account: Account): number {
        return ((account.balance.toNumber() * 1000) + (event.balance * 1000)) / 1000;
    }

    private toJson(account: Account): DepositResponseDto {
        return {
            destination: {
                id: account.id,
                balance: account.balance.toNumber(),
            }
        };
    }
}
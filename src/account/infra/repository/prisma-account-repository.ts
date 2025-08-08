import { Injectable } from "@nestjs/common";
import { Account } from "@prisma/client";
import { AccountModel } from "src/account/domain/entity/account.entity";
import { AccountRepository } from "src/account/domain/repository/account-repository";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
    constructor(private readonly prismaService: PrismaService) { }


    async findById(id: string): Promise<Account | null> {
        return this.prismaService.account.findUnique({
            where: { id },
        });
    }

    async save(account: AccountModel): Promise<Account> {
        const result = await this.prismaService.account.upsert({
            where: { id: account.id },
            create: account,
            update: account,
        });

        return result;
    }

    async saveAll(accounts: AccountModel[]): Promise<Account[]> {
        const savedAccounts: Account[] = [];
        for (const account of accounts) {
            const savedAccount = await this.save(account);
            savedAccounts.push(savedAccount);
        }
        return savedAccounts;
    }


    async delete(id: string): Promise<void> {
        await this.prismaService.account.delete({
            where: { id },
        });
    }

    async resetTable(): Promise<void> {
        await this.prismaService.account.deleteMany({});
    }

}
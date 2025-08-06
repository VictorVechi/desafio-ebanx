import { Injectable } from "@nestjs/common";
import { Account } from "@prisma/client";
import { AccountModel } from "src/account/domain/entity/account.dto";
import { AccountRepository } from "src/account/domain/repository/account-repository";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
    constructor(private readonly prismaService: PrismaService) {}


    async findById(id: number): Promise<Account | null> {
        return this.prismaService.account.findUnique({
            where: { id },
        });
    }
    
    async save(account: AccountModel): Promise<void> {
        await this.prismaService.account.upsert({
            where: { id: account.id },
            create: account,
            update: account,
        });
    }
    async delete(id: number): Promise<void> {
        await this.prismaService.account.delete({
            where: { id },
        });
    }
    
    async resetTable(): Promise<void> {
        await this.prismaService.account.deleteMany({});
    }

}
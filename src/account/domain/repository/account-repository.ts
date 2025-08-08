import { Account } from "@prisma/client";
import { AccountModel } from "../entity/account.entity";


export abstract class AccountRepository {
    abstract findById(id: string): Promise<Account | null>;
    abstract save(account: AccountModel): Promise<Account>;
    abstract saveAll(accounts: AccountModel[]): Promise<Account[]>
    abstract resetTable(): Promise<void>;
}
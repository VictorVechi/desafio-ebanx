import { Account } from "@prisma/client";
import { AccountModel } from "../entity/account.entity";


export abstract class AccountRepository {
    abstract findById(id: string): Promise<Account | null>;
    abstract save(account: AccountModel): Promise<Account>;
    abstract delete(id: string): Promise<void>;
    abstract resetTable(): Promise<void>;
}
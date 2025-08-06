import { Account } from "@prisma/client";
import { AccountModel } from "../entity/account.dto";


export abstract class AccountRepository {
    abstract findById(id: number): Promise<Account | null>;
    abstract save(account: AccountModel): Promise<void>;
    abstract delete(id: number): Promise<void>;
    abstract resetTable(): Promise<void>;
}
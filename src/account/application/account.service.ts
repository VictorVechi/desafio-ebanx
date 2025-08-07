import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../domain/repository/account-repository';
import { Account } from '@prisma/client';
import { AccountModel } from '../domain/entity/account.entity';

@Injectable()
export class AccountService {
    constructor(private readonly accountRepository: AccountRepository) {}
    async reset(): Promise<void> {
        try {
            await this.accountRepository.resetTable();
        } catch (error) {
            console.error('Error resetting account table:', error);
            throw new Error('Failed to reset account table');
        }
    }

    async findAccountById(id: string): Promise<Account | null> {
        try {
            return await this.accountRepository.findById(id);
        } catch (error) {
            console.error('Error finding account by ID:', error);
            throw new Error('Failed to find account');
        }
    }

    async saveAccount(account: AccountModel): Promise<Account> {
        try {
            return await this.accountRepository.save(account);
        } catch (error) {
            console.error('Error saving account:', error);
            throw new Error('Failed to save account');
        }
    }

    async saveAccounts(accounts: AccountModel[]): Promise<Account[]> {
        try {
            return await this.accountRepository.saveAll(accounts);
        } catch (error) {
            console.error('Error saving accounts:', error);
            throw new Error('Failed to save accounts');
        }
    }
}

import { Decimal } from '@prisma/client/runtime/library';
import { AccountService } from 'src/account/application/account.service';
import { AccountRepository } from 'src/account/domain/repository/account-repository';

describe('AccountService', () => {
    let service: AccountService;
    let repository: jest.Mocked<AccountRepository>;
    jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        repository = {
            resetTable: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            saveAll: jest.fn(),
            delete: jest.fn(),
        } as any;
        service = new AccountService(repository);
    });

    it('should reset table', async () => {
        await service.reset();
        expect(repository.resetTable).toHaveBeenCalled();
    });

    it('should capture an exception when resetting table', async () => {
        repository.resetTable.mockRejectedValue(new Error('Error'));
        await expect(service.reset()).rejects.toThrow('Failed to reset account table');
    });

    it('should return null if account does not exist', async () => {
        repository.findById.mockResolvedValue(null);
        const result = await service.getBalance('id');
        expect(result).toBeNull();
    });

    it('should capture an exception when finding account by ID', async () => {
        repository.findById.mockRejectedValue(new Error('Error'));
        await expect(service.findAccountById('id')).rejects.toThrow('Failed to find account');
    });

    it('should save an account', async () => {
        repository.save.mockResolvedValue({
            id: 'id',
            balance: new Decimal(100),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await expect(service.saveAccount({ id: 'id', balance: 100 })).resolves.toEqual({
            id: 'id',
            balance: new Decimal(100),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    it('should capture an exception when saving an account', async () => {
        repository.save.mockRejectedValue(new Error('Error'));
        await expect(service.saveAccount({ id: 'id', balance: 100 })).rejects.toThrow('Failed to save account');
    });

    it('should save an account', async () => {
        repository.saveAll.mockResolvedValue(
            [
                {
                    id: 'id',
                    balance: new Decimal(100),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ]
        );

        await expect(service.saveAccounts([{ id: 'id', balance: 100 }])).resolves.toEqual([
            {
                id: 'id',
                balance: new Decimal(100),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            }
        ]);
    });

    it('should capture an exception when saving an account', async () => {
        repository.saveAll.mockRejectedValue(new Error('Error'));
        await expect(service.saveAccounts([{ id: 'id', balance: 100 }])).rejects.toThrow('Failed to save accounts');
    });

    it('should return balance as number', async () => {
        repository.findById.mockResolvedValue({
            id: 'id',
            balance: { toNumber: () => 100 },
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any);
        const result = await service.getBalance('id');
        expect(result).toBe(100);
    });

    it('should capture an exception when getting balance', async () => {
        repository.findById.mockRejectedValue(new Error('Error'));
        await expect(service.getBalance('id')).rejects.toThrow('Failed to fetch account balance');
    });
});
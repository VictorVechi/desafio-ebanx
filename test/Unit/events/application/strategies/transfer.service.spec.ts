import { Decimal } from "@prisma/client/runtime/library"
import { AccountService } from "src/account/application/account.service"
import { PrismaAccountRepository } from "src/account/infra/repository/prisma-account-repository"
import { PrismaService } from "src/database/prisma.service"
import { TransferServiceStrategy } from "src/events/application/strategies/transfer.service"
import { insufficientFundsTransferEventMock, invalidTransferEventMock, transferEventMock } from "test/Unit/mocks/event.mock"




describe('TransferServiceStrategy', () => {
    let transferService: TransferServiceStrategy
    let accountService: jest.Mocked<AccountService>
    let accountRepository: jest.Mocked<PrismaAccountRepository>
    let prismaService: PrismaService


    beforeEach(() => {
        prismaService = new PrismaService()
        accountRepository = new PrismaAccountRepository(prismaService) as jest.Mocked<PrismaAccountRepository>
        accountService = new AccountService(accountRepository) as jest.Mocked<AccountService>
        transferService = new TransferServiceStrategy(accountService)
    });


    it('should execute transfer transaction and create destination account', async () => {

        accountService.findAccountById = jest.fn().mockResolvedValueOnce({
            id: '10',
            balance: new Decimal(100),
            createdAt: new Date(),
            updatedAt: new Date(),
        }).mockResolvedValueOnce(null)

        accountService.saveAccount = jest.fn().mockResolvedValue({
            id: '20',
            balance: new Decimal(0),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        accountService.saveAccounts = jest.fn().mockResolvedValue([
            {
                id: '10',
                balance: new Decimal(50),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: '20',
                balance: new Decimal(50),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ])

        const response = await transferService.executeTransaction(transferEventMock)
        expect(response).toEqual({
            origin: {
                id: '10',
                balance: 50,
            },
            destination: {
                id: '20',
                balance: 50,
            }
        })
    });

    it('should execute transfer transaction and update destination account', async () => {

        accountService.findAccountById = jest.fn().mockResolvedValueOnce({
            id: '10',
            balance: new Decimal(100),
            createdAt: new Date(),
            updatedAt: new Date(),
        }).mockResolvedValueOnce({
            id: '20',
            balance: new Decimal(0),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        accountService.saveAccounts = jest.fn().mockResolvedValue([
            {
                id: '10',
                balance: new Decimal(50),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: '20',
                balance: new Decimal(50),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ])

        const response = await transferService.executeTransaction(transferEventMock)
        expect(response).toEqual({
            origin: {
                id: '10',
                balance: 50,
            },
            destination: {
                id: '20',
                balance: 50,
            }
        })
    });

    it('should not transfer with no funds', async () => {

        accountService.findAccountById = jest.fn().mockResolvedValueOnce({
            id: '10',
            balance: new Decimal(100),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        await expect(transferService.executeTransaction(insufficientFundsTransferEventMock))
            .rejects.toThrow('Insufficient funds for transfer')
    });

    it('should return null when origin account does not exist', async () => {

        accountService.findAccountById = jest.fn().mockResolvedValueOnce(null)

        const response = await transferService.executeTransaction(transferEventMock)
        expect(response).toEqual(null)
    });

    it('should throw error with invalid data', async () => {
        await expect(transferService.executeTransaction(invalidTransferEventMock))
            .rejects.toThrow('Invalid transfer event data')
    });

})
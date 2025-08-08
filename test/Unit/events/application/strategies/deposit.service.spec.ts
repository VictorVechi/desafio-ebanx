import { Decimal } from "@prisma/client/runtime/library"
import { AccountService } from "src/account/application/account.service"
import { PrismaAccountRepository } from "src/account/infra/repository/prisma-account-repository"
import { PrismaService } from "src/database/prisma.service"
import { DepositServiceStrategy } from "src/events/application/strategies/deposit.service"
import { depositEventMock, invalidDepositEventMock } from "test/Unit/mocks/event.mock"




describe('DepositServiceStrategy', () => {
    let depositService: DepositServiceStrategy
    let accountService: jest.Mocked<AccountService>
    let accountRepository: jest.Mocked<PrismaAccountRepository>
    let prismaService: PrismaService


    beforeEach(() => {
        prismaService = new PrismaService()
        accountRepository = new PrismaAccountRepository(prismaService) as jest.Mocked<PrismaAccountRepository>
        accountService = new AccountService(accountRepository) as jest.Mocked<AccountService>
        depositService = new DepositServiceStrategy(accountService)
    })

    it('should execute deposit transaction and create an new account', async () => {

        accountService.findAccountById = jest.fn().mockResolvedValue(null)

        accountService.saveAccount = jest.fn().mockResolvedValue({
            id: '10',
            balance: new Decimal(100),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const result = await depositService.executeTransaction(depositEventMock)
        expect(result).toEqual({
            destination: {
                id: '10',
                balance: 100,
            }
        })
    });

    it('should execute deposit transaction and update account', async () => {

        accountService.findAccountById = jest.fn().mockResolvedValue({
            id: '10',
            balance: new Decimal(100),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        accountService.saveAccount = jest.fn().mockResolvedValue({
            id: '10',
            balance: new Decimal(200),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const result = await depositService.executeTransaction(depositEventMock)
        expect(result).toEqual({
            destination: {
                id: '10',
                balance: 200,
            }
        })
    });


    it('should throw an error if event data is invalid', async () => {

        await expect(depositService.executeTransaction(invalidDepositEventMock))
            .rejects.toThrow('Invalid deposit event data');
    });

})
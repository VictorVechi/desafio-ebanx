import { Decimal } from "@prisma/client/runtime/library"
import { AccountService } from "src/account/application/account.service"
import { PrismaAccountRepository } from "src/account/infra/repository/prisma-account-repository"
import { PrismaService } from "src/database/prisma.service"
import { WithdrawServiceStrategy } from "src/events/application/strategies/withdraw.service"
import { invalidWithdrawEventMock, withdrawEventMock } from "test/Unit/mocks/event.mock"




describe('WithdrawServiceStrategy', () => {
    let withdrawService: WithdrawServiceStrategy
    let accountService: jest.Mocked<AccountService>
    let accountRepository: jest.Mocked<PrismaAccountRepository>
    let prismaService: PrismaService


    beforeEach(() => {
        prismaService = new PrismaService()
        accountRepository = new PrismaAccountRepository(prismaService) as jest.Mocked<PrismaAccountRepository>
        accountService = new AccountService(accountRepository) as jest.Mocked<AccountService>
        withdrawService = new WithdrawServiceStrategy(accountService)
    })

    it('should execute withdraw transaction and update account', async () => {
        accountService.findAccountById = jest.fn().mockResolvedValue({
            id: '10',
            balance: new Decimal(100),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        accountService.saveAccount = jest.fn().mockResolvedValue({
            id: '10',
            balance: new Decimal(50),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const result = await withdrawService.executeTransaction(withdrawEventMock)
        expect(result).toEqual({
            origin: {
                id: '10',
                balance: 50,
            }
        })
    });

    it('should return null when does not find account', async () => {
        accountService.findAccountById = jest.fn().mockResolvedValue(null)

        const result = await withdrawService.executeTransaction(withdrawEventMock)
        expect(result).toBeNull()
    });

    it('should throw error with no funds', async () => {
        accountService.findAccountById = jest.fn().mockResolvedValue({
            id: '10',
            balance: new Decimal(10),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        await expect(withdrawService.executeTransaction(withdrawEventMock))
            .rejects.toThrow("Insufficient funds for withdrawal")
    });

    it('should throw error with invalid withdraw event', async () => {

        await expect(withdrawService.executeTransaction(invalidWithdrawEventMock))
            .rejects.toThrow("Invalid withdraw event data")
    });

})
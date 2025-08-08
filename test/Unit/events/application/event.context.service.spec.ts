import { AccountService } from "src/account/application/account.service";
import { PrismaAccountRepository } from "src/account/infra/repository/prisma-account-repository";
import { PrismaService } from "src/database/prisma.service";
import { EventContextService } from "src/events/application/event-context.service";
import { DepositServiceStrategy } from "src/events/application/strategies/deposit.service";
import { TransferServiceStrategy } from "src/events/application/strategies/transfer.service";
import { WithdrawServiceStrategy } from "src/events/application/strategies/withdraw.service"
import { depositEventMock, invalidEvent, transferEventMock, withdrawEventMock } from "test/Unit/mocks/event.mock";

describe('EventContextService', () => {
    let eventContextService: EventContextService;
    let withdrawService: jest.Mocked<WithdrawServiceStrategy>;
    let transferService: jest.Mocked<TransferServiceStrategy>;
    let depositService: jest.Mocked<DepositServiceStrategy>;
    let accountService: jest.Mocked<AccountService>
    let accountRepository: jest.Mocked<PrismaAccountRepository>
    let prismaService: jest.Mocked<PrismaService>


    beforeEach(() => {
        prismaService = new PrismaService() as jest.Mocked<PrismaService>
        accountRepository = new PrismaAccountRepository(prismaService) as jest.Mocked<PrismaAccountRepository>
        accountService = new AccountService(accountRepository) as jest.Mocked<AccountService>
        withdrawService = new WithdrawServiceStrategy(accountService) as jest.Mocked<WithdrawServiceStrategy>
        transferService = new TransferServiceStrategy(accountService) as jest.Mocked<TransferServiceStrategy>
        depositService = new DepositServiceStrategy(accountService) as jest.Mocked<DepositServiceStrategy>

        eventContextService = new EventContextService(depositService, transferService, withdrawService);
    })

    it('should process deposit event', async () => {
        const response = {
            destination: {
                id: '10',
                balance: 100
            }
        };
        depositService.executeTransaction = jest.fn().mockResolvedValue(response);

        const result = await eventContextService.processEvent(depositEventMock);
        expect(result).toEqual(response);
        expect(depositService.executeTransaction).toHaveBeenCalledWith(depositEventMock);
    });

    it('should process transfer event', async () => {
        const response = {
            origin: {
                id: '10',
                balance: 100
            },
            destination: {
                id: '20',
                balance: 200
            }
        };
        transferService.executeTransaction = jest.fn().mockResolvedValue(response);

        const result = await eventContextService.processEvent(transferEventMock);
        expect(result).toEqual(response);
        expect(transferService.executeTransaction).toHaveBeenCalledWith(transferEventMock);
    });

    it('should process withdraw event', async () => {
        const response = {
            origin: {
                id: '10',
                balance: 50
            }
        };
        withdrawService.executeTransaction = jest.fn().mockResolvedValue(response);

        const result = await eventContextService.processEvent(withdrawEventMock);
        expect(result).toEqual(response);
        expect(withdrawService.executeTransaction).toHaveBeenCalledWith(withdrawEventMock);
    });

    it('should throw error for unknown event type', async () => {
        await expect(eventContextService.processEvent(invalidEvent))
            .rejects.toThrow('Unknown event type: UNKNOWN');
    });

})

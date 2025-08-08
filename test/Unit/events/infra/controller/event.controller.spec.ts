import { AccountService } from "src/account/application/account.service";
import { AccountController } from "src/account/infra/controller/account.controller";
import { PrismaAccountRepository } from "src/account/infra/repository/prisma-account-repository";
import { PrismaService } from "src/database/prisma.service";
import { EventContextService } from "src/events/application/event-context.service";
import { DepositServiceStrategy } from "src/events/application/strategies/deposit.service";
import { TransferServiceStrategy } from "src/events/application/strategies/transfer.service";
import { WithdrawServiceStrategy } from "src/events/application/strategies/withdraw.service";
import { EventContextInterface } from "src/events/domain/application/event-context-interface";
import { EventController } from "src/events/infra/controller/event.controller";
import { depositEventMock } from "test/Unit/mocks/event.mock";



describe('EventController', () => {
    let controller: EventController;
    let eventContextService: EventContextService;
    let withdrawService: jest.Mocked<WithdrawServiceStrategy>;
    let transferService: jest.Mocked<TransferServiceStrategy>;
    let depositService: jest.Mocked<DepositServiceStrategy>;
    let accountService: jest.Mocked<AccountService>
    let accountRepository: jest.Mocked<PrismaAccountRepository>
    let prismaService: jest.Mocked<PrismaService>;

    jest.spyOn(console, 'error').mockImplementation(() => { });

    beforeEach(() => {
        prismaService = new PrismaService() as jest.Mocked<PrismaService>;
        accountRepository = new PrismaAccountRepository(prismaService) as jest.Mocked<PrismaAccountRepository>;
        accountService = new AccountService(accountRepository) as jest.Mocked<AccountService>;
        withdrawService = new WithdrawServiceStrategy(accountService) as jest.Mocked<WithdrawServiceStrategy>;
        transferService = new TransferServiceStrategy(accountService) as jest.Mocked<TransferServiceStrategy>;
        depositService = new DepositServiceStrategy(accountService) as jest.Mocked<DepositServiceStrategy>;
        eventContextService = new EventContextService(depositService, transferService, withdrawService);

        controller = new EventController(eventContextService);
    });

    it('should process deposit event', async () => {
        const response = {
            destination: {
                id: '10',
                balance: 100
            }
        };
        depositService.executeTransaction = jest.fn().mockResolvedValue(response);
        const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

        await controller.handleEvent(depositEventMock, mockRes);
        expect(depositService.executeTransaction).toHaveBeenCalledWith(depositEventMock);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.send).toHaveBeenCalledWith(response);
    });

    it('should process deposit event', async () => {
        ;
        depositService.executeTransaction = jest.fn().mockResolvedValue(null);
        const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

        await controller.handleEvent(depositEventMock, mockRes);
        expect(depositService.executeTransaction).toHaveBeenCalledWith(depositEventMock);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith(0);
    });


    it('should return 500 if eventContextService.processEvent throws', async () => {
        jest.spyOn(eventContextService, 'processEvent').mockRejectedValue(new Error('fail'));
        const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

        await controller.handleEvent(depositEventMock, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
})
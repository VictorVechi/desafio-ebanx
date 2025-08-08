import { AccountService } from "src/account/application/account.service";
import { AccountController } from "src/account/infra/controller/account.controller";
import { PrismaAccountRepository } from "src/account/infra/repository/prisma-account-repository";
import { PrismaService } from "src/database/prisma.service";



describe('AccountController', () => {
    let controller: AccountController;
    let accountService: jest.Mocked<AccountService>;
    let accountRepository: jest.Mocked<PrismaAccountRepository>;
    let prismaService: jest.Mocked<PrismaService>;

    jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        prismaService = new PrismaService() as jest.Mocked<PrismaService>;
        accountRepository = new PrismaAccountRepository(prismaService) as jest.Mocked<PrismaAccountRepository>;
        accountService = new AccountService(accountRepository) as jest.Mocked<AccountService>;
        controller = new AccountController(accountService);
    });

    it('should reset the account table', async () => {
        accountService.reset = jest.fn().mockResolvedValue(undefined);
        const mockRes = { sendStatus: jest.fn() } as any;
        await controller.reset(mockRes);
        expect(accountService.reset).toHaveBeenCalled();
    });

    it('should capture an error if reset fails', async () => {
        const mockRes = { sendStatus: jest.fn() } as any;
        accountService.reset = jest.fn().mockRejectedValue(new Error('Reset failed'));
        await controller.reset(mockRes);
        expect(accountService.reset).toHaveBeenCalled();
    });

    it('should get balance', async () => {
        accountService.getBalance = jest.fn().mockResolvedValue(100);
        const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
        await controller.getBalance(mockRes, 'account_id');
        expect(accountService.getBalance).toHaveBeenCalledWith('account_id');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith(100);
    });

    it('should return 404 if account is not found', async () => {
        accountService.getBalance = jest.fn().mockResolvedValue(null);
        const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
        await controller.getBalance(mockRes, 'account_id');
        expect(accountService.getBalance).toHaveBeenCalledWith('account_id');
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith(0);
    });

    it('should return 404 if account is not found', async () => {
        accountService.getBalance = jest.fn().mockRejectedValue(new Error('Failed to fetch account balance'));
        const mockRes = { sendStatus: jest.fn() } as any;
        await controller.getBalance(mockRes, 'account_id');
        expect(accountService.getBalance).toHaveBeenCalledWith('account_id');
        expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    });

});
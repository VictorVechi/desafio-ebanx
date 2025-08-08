import { Decimal } from "@prisma/client/runtime/library";
import { PrismaAccountRepository } from "src/account/infra/repository/prisma-account-repository";
import { PrismaService } from "src/database/prisma.service";



describe('PrismaAccountRepository', () => {
    let repository: PrismaAccountRepository;
    let prismaService: jest.Mocked<PrismaService>;

    beforeEach(() => {
        prismaService = new PrismaService() as jest.Mocked<PrismaService>;
        repository = new PrismaAccountRepository(prismaService);
    });


    it('should find account by id', async () => {
        prismaService.account.findUnique = jest.fn().mockResolvedValue(
            {
                id: 'id',
                balance: new Decimal(100),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        )

        const account = await repository.findById('id');
        expect(account).toEqual({
            id: 'id',
            balance: new Decimal(100),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    it('should return null if account not found', async () => {
        prismaService.account.findUnique = jest.fn().mockResolvedValue(null);

        const account = await repository.findById('non-existing-id');
        expect(account).toBeNull();
    });

    it('should save an account', async () => {
        const accountData = {
            id: 'id',
            balance: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        prismaService.account.upsert = jest.fn().mockResolvedValue(accountData);

        const savedAccount = await repository.save(accountData);
        expect(savedAccount).toEqual(accountData);
    });


    it('should save multiple accounts', async () => {
        const accountDataArray = [
            {
                id: 'id1',
                balance: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];

        prismaService.account.upsert = jest.fn().mockResolvedValue({
            id: 'id1',
            balance: 100,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });

        const savedAccounts = await repository.saveAll(accountDataArray);
        expect(savedAccounts).toEqual([
            {
                id: 'id1',
                balance: 100,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            }
        ]);
    });

    it('should reset the account table', async () => {
        prismaService.account.deleteMany = jest.fn().mockResolvedValue({ count: 1 });

        await repository.resetTable();
        expect(prismaService.account.deleteMany).toHaveBeenCalledWith({});
    });

});
import { PrismaService } from "src/database/prisma.service";

describe('PrismaService', () => {
    let service: PrismaService;

    beforeEach(() => {
        service = new PrismaService();
        jest.spyOn(service, '$connect').mockResolvedValue(undefined);
    });

    it('should connect to the database', async () => {
        await service.onModuleInit();
        expect(service.$connect).toHaveBeenCalled();
    });
});
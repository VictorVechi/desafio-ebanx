

export class TransferResponseDto {
    origin: {
        id: string;
        balance: number;
    };
    destination: {
        id: string;
        balance: number;
    };
}
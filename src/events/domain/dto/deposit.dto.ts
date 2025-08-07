import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DepositDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    destination: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;
}
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class AccountModel {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsNumber()
    balance: number;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;
}
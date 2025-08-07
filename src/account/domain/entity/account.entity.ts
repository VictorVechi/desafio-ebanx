import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class AccountModel {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsNumber()
    balance: number;
}
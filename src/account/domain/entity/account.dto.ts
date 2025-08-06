import { IsNotEmpty, IsNumber } from "class-validator";


export class AccountModel {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    balance: number;
}
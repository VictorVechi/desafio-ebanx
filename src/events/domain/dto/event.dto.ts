import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class EventDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    origin?: string;

    @IsString()
    @IsOptional()
    destination?: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

}
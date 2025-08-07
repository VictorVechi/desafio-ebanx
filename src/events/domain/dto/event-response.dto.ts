import { DepositResponseDto } from "./deposit-response.dto";
import { TransferResponseDto } from "./transfer-response.dto";
import { WithdrawResponseDto } from "./withdraw-response.dto";


export type EventResponseDto =
    | DepositResponseDto 
    | WithdrawResponseDto 
    | TransferResponseDto
    | null;
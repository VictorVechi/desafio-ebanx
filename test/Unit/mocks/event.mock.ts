import { EventDto } from "src/events/domain/dto/event.dto";
import { EventType } from "src/events/domain/enum/event-enum";


export const depositEventMock: EventDto = {
    type: EventType.DEPOSIT,
    destination: '10',
    amount: 100,
};

export const invalidDepositEventMock: EventDto = {
    type: EventType.DEPOSIT,
    destination: '',
    amount: 0,
};

export const transferEventMock: EventDto = {
    type: EventType.TRANSFER,
    origin: '10',
    destination: '20',
    amount: 50,
}

export const invalidTransferEventMock: EventDto = {
    type: EventType.TRANSFER,
    origin: '',
    destination: '',
    amount: 0,
};

export const insufficientFundsTransferEventMock: EventDto = {
    type: EventType.TRANSFER,
    origin: '10',
    destination: '20',
    amount: 1000,
};

export const withdrawEventMock: EventDto = {
    type: EventType.WITHDRAW,
    origin: '10',
    amount: 50,
};

export const invalidWithdrawEventMock: EventDto = {
    type: EventType.WITHDRAW,
    origin: '',
    amount: 0,
};

export const invalidEvent: EventDto = {
    type: 'UNKNOWN',
    origin: '10',
    destination: '20',
    amount: 100,
};


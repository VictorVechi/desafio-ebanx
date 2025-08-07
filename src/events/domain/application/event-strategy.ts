import { EventResponseDto } from "../dto/event-response.dto";


export abstract class EventStrategy {
    abstract executeTransaction(event: any): Promise<EventResponseDto>;
}
import { EventResponseDto } from "../dto/event-response.dto";
import { EventDto } from "../dto/event.dto";


export abstract class EventStrategy {
    abstract executeTransaction(event: EventDto): Promise<EventResponseDto>;
}
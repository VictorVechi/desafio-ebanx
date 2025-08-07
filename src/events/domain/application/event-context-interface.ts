import { EventResponseDto } from "../dto/event-response.dto";
import { EventDto } from "../dto/event.dto";


export abstract class EventContextInterface {
    abstract processEvent(event: EventDto): Promise<EventResponseDto>
}
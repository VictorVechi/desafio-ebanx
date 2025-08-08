import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { EventContextInterface } from "src/events/domain/application/event-context-interface";
import { EventDto } from "src/events/domain/dto/event.dto";


@Controller()
export class EventController {
    constructor(private readonly eventContext: EventContextInterface) {}

    @Post('/event')
    async handleEvent(@Body() body: EventDto, @Res() res: Response): Promise<void> {
        try {
            const response = await this.eventContext.processEvent(body);
            if (!response) {
                res.status(HttpStatus.NOT_FOUND).send(0);
                return;
            }
            res.status(HttpStatus.CREATED).send(response);
        } catch (error) {
            console.error('Error processing event:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
        }
    }
}
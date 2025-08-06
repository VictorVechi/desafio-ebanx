import { Body, Controller, Post } from "@nestjs/common";




@Controller() 
export class EventController {
    constructor() {}

    @Post('/event')
    async handleEvent(@Body() body: any): Promise<any> {
        // Logic to handle the event
        return { message: "Event handled successfully" };
    }
}
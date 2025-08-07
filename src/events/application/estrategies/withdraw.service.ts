import { Injectable } from "@nestjs/common";
import { AccountService } from "src/account/application/account.service";
import { EventStrategy } from "src/events/domain/application/event-strategy";
import { EventDto } from "src/events/domain/dto/event.dto";


@Injectable()
export class WithdrawServiceStrategy implements EventStrategy {
    constructor(private readonly accountService: AccountService) {}
    async executeTransaction(event: EventDto): Promise<any> {
        // Implement the logic for processing deposit events here
        console.log("Processing deposit event:", event);
        // Simulate some processing logic
        return Promise.resolve({ status: "success", event });
    }
}
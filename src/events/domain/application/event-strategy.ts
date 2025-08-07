

export abstract class EventStrategy {
    abstract executeTransaction(event: any): Promise<any>;
}
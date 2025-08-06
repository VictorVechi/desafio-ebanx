import { Module } from '@nestjs/common';
import { EventController } from './infrastructure/controller/event.controller';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [],
})
export class EventModule {}

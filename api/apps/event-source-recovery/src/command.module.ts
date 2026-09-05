import { Module } from '@nestjs/common';
import CommandService from './command.service';
import RecoverModule from './recover/recover.module';

@Module({
  imports: [RecoverModule],
  providers: [CommandService],
})
export default class CommandModule {}

import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import RecoverService from './recover/recover.service';

@Command({ name: 'recover', arguments: '[name]', description: 'A parameter parse' })
export default class CommandController extends CommandRunner {
  private readonly logger = new Logger('Command');

  constructor(private readonly recoverService: RecoverService) {
    super();
  }

  run(passedParams: string[]): any {
    const name = passedParams[0];
    void this.recoverService.recover(name);
  }
}

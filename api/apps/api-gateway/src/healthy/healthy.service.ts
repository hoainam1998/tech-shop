import { Injectable } from '@nestjs/common';
import { TcpClientOptions, Transport } from '@nestjs/microservices';
import {
  HealthCheckService,
  MicroserviceHealthIndicator,
  HealthCheckResult,
  HealthCheckAttempt,
} from '@nestjs/terminus';
import ENVService from '@share/environment-config/env-config.service';

@Injectable()
export default class HealthyService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly envService: ENVService,
  ) {}

  private check(name: string): HealthCheckAttempt<string> {
    return this.microservice.pingCheck<TcpClientOptions>(`${name}_microservice`, {
      transport: Transport.TCP,
      options: {
        host: this.envService.ServiceHost.CATEGORY_MICROSERVICE_TCP_HOST,
        port: this.envService.Port.CATEGORY_MICROSERVICE_TCP_PORT,
      },
    });
  }

  checkAll(): Promise<HealthCheckResult> {
    return this.health.check([() => this.check('category')]);
  }
}

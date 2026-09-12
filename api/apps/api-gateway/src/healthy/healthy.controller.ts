import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import HealthyRouter from '@share/router/healthy';
import HealthyService from './healthy.service';

@Controller(HealthyRouter.BaseUrl)
export default class HealthyController {
  constructor(private readonly healthService: HealthyService) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthService.checkAll();
  }
}

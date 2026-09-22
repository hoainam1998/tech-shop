import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  databaseConfig,
  eventSource,
  portConfig,
  emailConfig,
  throttleConfig,
  sessionConfig,
  socketConfig,
  redisConfig,
  bullMq,
} from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        eventSource,
        portConfig,
        emailConfig,
        throttleConfig,
        sessionConfig,
        socketConfig,
        redisConfig,
        bullMq,
      ],
      isGlobal: true,
      expandVariables: true,
    }),
  ],
})
export default class EnvironmentConfigModule {}

export const RedisConfig = ConfigModule.forFeature(redisConfig);

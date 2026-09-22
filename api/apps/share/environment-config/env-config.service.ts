import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENTS } from '@share/enums';

type PortEnvConfig = {
  API_PORT: number;
  CATEGORY_MICROSERVICE_TCP_PORT: number;
};

type DatabaseConfig = {
  DATABASE_URL: string;
};

type EventSourceConfig = {
  AGGREGATES_TABLE_NAME: string;
  EVENT_SOURCE_DATABASE_URL: string;
  EVENTS_TABLE_NAME: string;
  SCHEMA_NAME: string;
  SNAPSHOT_TABLE_NAME: string;
};

type RedisConfig = {
  REDIS_SERVER_HOST: string;
  REDIS_SERVER_PORT: number;
};

type BullMqConfig = {
  BULLMQ_SERVER_HOST: string;
  BULLMQ_SERVER_PORT: number;
};

type MailConfig = {
  SMPT_HOST: string;
  SMPT_PORT: number;
  SMPT_MAIL: string;
  SMPT_APP_PASS: string;
  EMAIL_TEMPLATES: string;
  SYSTEM_ADMIN_EMAIL: string;
};

type ServiceHost = {
  CATEGORY_MICROSERVICE_TCP_HOST: string;
};

type RateLimitingConfig = {
  THROTTLE_LIMIT: number;
  USER_TTL: number;
};

@Injectable()
export default class ENVService {
  constructor(private readonly configService: ConfigService) {}

  private get<T>(key: string) {
    return this.configService.getOrThrow<T>(key);
  }

  get Localhost() {
    return this.get<string>('LOCALHOST') || '';
  }

  get DockerInternalHost() {
    return 'host.docker.internal';
  }

  get NodeENV() {
    return process.env.NODE_ENV;
  }

  get IsDockerBuild() {
    return this.NodeENV === ENVIRONMENTS.DOCKER;
  }

  get ServiceHost(): ServiceHost {
    return {
      CATEGORY_MICROSERVICE_TCP_HOST: this.IsDockerBuild ? this.DockerInternalHost : this.Localhost,
    };
  }

  get Port(): PortEnvConfig {
    return {
      API_PORT: parseInt(this.get<string>('ports.API_PORT')),
      CATEGORY_MICROSERVICE_TCP_PORT: parseInt(this.get<string>('ports.CATEGORY_MICROSERVICE_TCP_PORT')),
    };
  }

  get Database(): DatabaseConfig {
    return {
      DATABASE_URL: this.get<string>('database.DATABASE_URL'),
    };
  }

  get EventSource(): EventSourceConfig {
    return {
      AGGREGATES_TABLE_NAME: this.get<string>('event_source.AGGREGATES_TABLE_NAME'),
      EVENT_SOURCE_DATABASE_URL: this.get<string>('event_source.EVENT_SOURCE_DATABASE_URL'),
      EVENTS_TABLE_NAME: this.get<string>('event_source.EVENTS_TABLE_NAME'),
      SCHEMA_NAME: this.get<string>('event_source.SCHEMA_NAME'),
      SNAPSHOT_TABLE_NAME: this.get<string>('event_source.SNAPSHOT_TABLE_NAME'),
    };
  }

  private get RedisServerHost() {
    return this.get<string>('redis.REDIS_SERVER_HOST');
  }

  get Redis(): RedisConfig {
    return {
      REDIS_SERVER_HOST: this.IsDockerBuild ? this.DockerInternalHost : this.RedisServerHost,
      REDIS_SERVER_PORT: parseInt(this.get<string>('redis.REDIS_SERVER_PORT')),
    };
  }

  private get BullMqServerHost() {
    return this.get<string>('bullMq.BULLMQ_SERVER_HOST');
  }

  get BullMqRedis(): BullMqConfig {
    return {
      BULLMQ_SERVER_HOST: this.IsDockerBuild ? this.DockerInternalHost : this.BullMqServerHost,
      BULLMQ_SERVER_PORT: parseInt(this.get<string>('bullMq.BULLMQ_SERVER_PORT')),
    };
  }

  get Mailer(): MailConfig {
    return {
      SMPT_HOST: this.get<string>('mail.SMPT_HOST'),
      SMPT_PORT: parseInt(this.get<string>('mail.SMPT_PORT')),
      SMPT_MAIL: this.get<string>('mail.SMPT_MAIL'),
      SMPT_APP_PASS: this.get<string>('mail.SMPT_APP_PASS'),
      EMAIL_TEMPLATES: this.get<string>('mail.EMAIL_TEMPLATES'),
      SYSTEM_ADMIN_EMAIL: this.get<string>('mail.SYSTEM_ADMIN_EMAIL'),
    };
  }

  get RateLimiting(): RateLimitingConfig {
    return {
      THROTTLE_LIMIT: parseInt(this.get<string>('throttle.THROTTLE_LIMIT')),
      USER_TTL: parseInt(this.get<string>('throttle.THROTTLE_TTL')),
    };
  }
}

import { applyDecorators } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsString, IsEnum, IsNumber, IsUrl, Max, Min, validateSync, IsEmail, IsOptional } from 'class-validator';
import { ENVIRONMENTS } from '@share/enums';

const AllowLocalUrl = IsUrl({ require_protocol: true, require_port: true, require_tld: false });
const IsPort = applyDecorators(IsNumber(), Min(0), Max(65535));

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(ENVIRONMENTS)
  NODE_ENV!: ENVIRONMENTS;

  @IsPort
  API_PORT!: number;

  @IsPort
  USER_MICROSERVICE_TCP_PORT!: number;

  @IsPort
  CATEGORY_MICROSERVICE_TCP_PORT!: number;

  @IsPort
  PRODUCT_MICROSERVICE_TCP_PORT!: number;

  @AllowLocalUrl
  ADMIN_ORIGIN_CORS!: string;

  @AllowLocalUrl
  SALE_ORIGIN_CORS!: string;

  @IsString()
  LOCALHOST!: string;

  @IsString()
  REDIS_SERVER_HOST!: string;

  @IsPort
  REDIS_SERVER_PORT!: number;

  @IsString()
  BULLMQ_SERVER_HOST!: string;

  @IsPort
  BULLMQ_SERVER_PORT!: number;

  @IsString()
  SMPT_HOST!: string;

  @IsPort
  SMPT_PORT!: number;

  @IsEmail()
  SMPT_MAIL!: string;

  @IsString()
  SMPT_APP_PASS!: string;

  @IsString()
  EMAIL_TEMPLATES!: string;

  @IsEmail()
  SYSTEM_ADMIN_EMAIL!: string;

  @IsNumber()
  @Min(0)
  THROTTLE_TTL!: number;

  @IsNumber()
  @Min(0)
  THROTTLE_LIMIT!: number;

  @IsString()
  AGGREGATES_TABLE_NAME!: string;

  @IsString()
  SCHEMA_NAME!: string;

  @IsString()
  EVENTS_TABLE_NAME!: string;

  @IsString()
  SNAPSHOT_TABLE_NAME!: string;

  @IsString()
  USER!: string;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  DATABASE_URL_REPLICA_ADMIN!: string;

  @IsString()
  DATABASE_URL_REPLICA_CUSTOMER!: string;

  @IsString()
  DATABASE_URL_REPLICA_EMPLOYEE!: string;

  @IsString()
  EVENT_SOURCE_DATABASE_URL!: string;
}

export default (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};

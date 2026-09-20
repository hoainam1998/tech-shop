import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const META_NAME = 'skip_idempotency';
export const IdempotencyTTL = Reflector.createDecorator<string>();
export const SkipIdempotency = SetMetadata(META_NAME, true);

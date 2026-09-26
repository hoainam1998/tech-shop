import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import RateLimitingException from '@share/exceptions/rate-limiting.exception';
import RateLimitingService from '@share/libs/rate-limiting/rate-limiting.service';
import RateLimitingRepository from '@share/libs/redis-storage/rate-limiting/rate-limiting.service';
import messages from '@share/constants/messages';
import { createMessages } from '@share/utils';

@Injectable()
export default class RateLimitingGuard implements CanActivate {
  constructor(
    private readonly rateLimitingRepository: RateLimitingRepository,
    private readonly rateLimitingService: RateLimitingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skip = this.rateLimitingService.skip(context.getHandler());
    if (skip) {
      return true;
    } else {
      const request = context.switchToHttp().getRequest();
      // Get api amount consume token.
      const amountConsumeToken = this.rateLimitingService.getTokenNumber(context.getHandler());
      // Get overall token stored in redis.
      const currentToken = await this.rateLimitingRepository.getRateLimitingTokenKey();
      // Check this request should pass.
      const allowRequest = this.rateLimitingService.shouldAllowRequest(currentToken, amountConsumeToken);
      // If that request allowed, increase overall token and specific ip token by amount consume token.
      if (allowRequest) {
        await this.rateLimitingRepository.increaseTokenBy(amountConsumeToken);
        await this.rateLimitingRepository.increaseTokenWithIpBy(request.ip as string, amountConsumeToken);
        return allowRequest;
      }
      throw new RateLimitingException(createMessages(messages.COMMON.THROTTLER_ERROR));
    }
  }
}

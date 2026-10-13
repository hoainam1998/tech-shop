import Caching from './caching';

/**
 * Caching class flow by aside strategy.
 * @class
 */
export default abstract class CacheAsideStrategy extends Caching {
  constructor(_name: string) {
    super(_name);
  }

  protected checkExist(): Promise<boolean> {
    return this.redisClient.Client.exists(this.Key).then((result) => result > 0);
  }

  /**
   * Get items stored in redis.
   */
  abstract getItems(): any;

  /**
   * Stored items to redis.
   * @param data - The items.
   */
  abstract setItems(data: any): Promise<any>;
}

import { PrismaClientReplica } from '@share/interfaces';
import RedisClient from '@share/libs/redis-client/redis';

/**
 * Base caching class.
 * @class
 * @abstract
 */
export default abstract class Caching {
  protected abstract readonly redisClient: RedisClient;
  protected abstract readonly prismaClient: PrismaClientReplica;

  constructor(private readonly _name: string) {}

  /**
   * Return name of cache entity name.
   */
  protected get Name() {
    return this._name;
  }

  /**
   * Return redis key for stored.
   */
  protected get Key() {
    return this.Name.toLowerCase();
  }

  /**
   * Check items exist return true, else false.
   */
  protected abstract checkExist(): Promise<boolean>;
}

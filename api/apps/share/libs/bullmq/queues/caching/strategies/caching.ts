import { PrismaClientReplica } from '@share/interfaces';
import RedisClient from '@share/libs/redis-client/redis';

export default abstract class Caching {
  protected abstract readonly redisClient: RedisClient;
  protected abstract readonly prismaClient: PrismaClientReplica;
  protected abstract get Name();
  protected abstract checkExist(): Promise<boolean>;
}

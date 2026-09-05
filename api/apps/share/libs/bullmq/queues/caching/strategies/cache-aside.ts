import Caching from './caching';

export default abstract class CacheAsideStrategy extends Caching {
  constructor(private _name: string) {
    super();
  }

  protected get Name() {
    return this._name;
  }

  protected get Key() {
    return this._name.toLowerCase();
  }

  protected checkExist(): Promise<boolean> {
    return this.redisClient.Client.exists(this.Key).then((result) => result > 0);
  }

  abstract getItems(): any;

  abstract setItems(data: any): void;
}

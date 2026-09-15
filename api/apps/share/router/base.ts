import { ValidateRouteUrlDecorator } from '@share/decorators';

/**
 * Format and split the path to absolute and relative.
 * @class
 */
export class Route {
  private _baseUrl: string;
  private _url: string;
  private _subUrl?: string;

  /**
   *
   * @param {string} baseUrl - The base url.
   * @param {string} url - The next url.
   * @param {string} subUrl - The sub url.
   */
  constructor(baseUrl: string, url: string, subUrl?: string) {
    this._baseUrl = baseUrl;
    this._url = url;
    this._subUrl = subUrl;
  }

  /**
   * Combine valid url to complete url.
   * @private
   * @param {string[]} urls - An url array.
   * @returns {string} - The finish path.
   */
  private createRoutePath(...urls: (string | undefined)[]): string {
    return urls.filter((url) => !!url).join('/');
  }

  /**
   * Get absolute path.
   */
  get Absolute() {
    return this.createRoutePath(this._baseUrl, this._url);
  }

  /**
   * Get relative path.
   */
  get Relative() {
    return this.createRoutePath(this._url, this._subUrl);
  }
}

/**
 * Organization and validate router, separate for test and dev mode.
 * @class
 * @abstract
 */
export default class Router {
  private _baseUrl: string = '';
  private static readonly _routes = new Map<string, unknown>();

  /**
   *
   * @param {string} baseUrl - The base url.
   */
  constructor(baseUrl: string) {
    if (!Router._routes.has(baseUrl)) {
      this.BaseUrl = baseUrl;
    }
  }

  /**
   * Return baseUrl.
   */
  protected set BaseUrl(url) {
    if (/^\w+$/m.test(url)) {
      this._baseUrl = url;
      Router._routes.set(this._baseUrl, this);
    } else {
      throw new Error('Base url is invalid!');
    }
  }

  /**
   * Get base url.
   */
  get BaseUrl() {
    return this._baseUrl;
  }

  /**
   * Get wildcard.
   */
  get WildCard() {
    return `${this.BaseUrl}/{*splat}`;
  }

  /**
   * Get router instance stored or create one if it not exist.
   * @param {string} baseUrl - The base url string.
   * @returns {Router} The router instance.
   */
  static getInstance<T extends Router>(baseUrl: string): T {
    if (this._routes.has(baseUrl)) {
      return this._routes.get(baseUrl)! as T;
    }
    const router = new this(baseUrl) as T;
    this._routes.set(baseUrl, router);
    return router;
  }

  /**
   * Create route instance. This instance include absolute and relative path.
   * @param {string} url - The next url.
   * @param {string} subUrl - The sub url.
   * @returns {Route} - The route instance.
   */
  @ValidateRouteUrlDecorator
  protected createRoute(url: string, subUrl?: string): Route {
    return new Route(this.BaseUrl, url, subUrl);
  }
}

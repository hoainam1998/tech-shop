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

  /**
   *
   * @param {string} baseUrl - The base url.
   */
  constructor(baseUrl: string) {
    this.BaseUrl = baseUrl;
  }

  protected set BaseUrl(url) {
    if (/^\w+$/m.test(url)) {
      this._baseUrl = url;
    } else {
      throw new Error('eee');
    }
  }

  get BaseUrl() {
    return this._baseUrl;
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

/**
 * Happen when logging type is valid or not defined!.
 */
export const logTypeInvalidError = new Error('Log type is not valid!');

/**
 * Happen when logger in undefined!
 */
export const loggerNotDefinedError = new Error('Logger was not defined!');

/**
 * Happen when controller base url is invalid!
 */
export const baseUrlInvalidError = new Error('Base url is invalid!');

/**
 * Happen when tenant name is invalid or not defined!
 */
export const tenantNameInvalidError = new Error('Tenant name is invalid!');

/**
 * Happen when request ID is not UUID!
 */
export const requestIdInvalidError = new Error('Request ID is invalid!');

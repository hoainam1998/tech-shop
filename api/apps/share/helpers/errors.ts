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

/**
 * Throw when there is at least one option in the option list of the module register that is a duplicate.
 * @param name - The option name.
 * @returns The duplicate option error.
 */
export const duplicateOptionError = (name: string) => new Error(`${name} is duplicate!`);

/**
 * Throw when exceeds the number of options that can be registered
 */
export const exceedNumberOptionCanBeRegisteredError = new Error(
  'Exceeds the number of options that can be registered!',
);

/**
 * Throw when the option name is not allow in option lists.
 * @param name - The option name.
 * @returns The exclude option error.
 */
export const optionNameNotInOptionsError = (name: string) => new Error(`The ${name} name not in the options!`);

/**
 * Throw when the value not is the allowed value range.
 * @param value - The current value.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The value not in the allowed range error.
 */
export const valueNotInAllowedRange = (value: number, min: number, max: number) =>
  new Error(`${value} not in the range from ${min} to ${max}!`);

/**
 * Throw when the value field name is invalid.
 * @param valueFieldName - The value field name.
 * @param whiteList - The allowed value field name.
 * @returns The invalid option value field name error.
 */
export const invalidOptionValueFieldName = (valueFieldName: string, whiteList: string[]) =>
  new Error(`${valueFieldName} not in [${whiteList.join(', ')}]!`);

/**
 * Throw when a type of option value is not allow (just only number).
 * @param valueFieldName - The value field name.
 * @returns Throw invalid type of option value error.
 */
export const invalidTypeOfOptionValue = (valueFieldName: string) =>
  new Error(`Type of ${valueFieldName} is not number!`);

/**
 * Throw when a value is not positive number.
 * @param value - The input value.
 * @returns The value is not positive number error.
 */
export const valueIsNotPositiveNumberError = (value: number) => new Error(`${value} is not positive number!`);

/**
 * Throw when a value is bigger than the value compared.
 * @param value - The input value.
 * @param valueToCompare - The compare value.
 * @returns The value is bigger than the compare value.
 */
export const valueIsBiggerThanError = (value: number, valueToCompare: number) =>
  new Error(`${value} must be less than ${valueToCompare}!`);

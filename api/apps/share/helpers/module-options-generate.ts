import { ModuleOptionName, ValueFieldNameType, type ModuleOptionType } from './options-module-validate';

type ModuleOptionsType = {
  [key in ModuleOptionName]: number;
};

/**
 * Generate module options.
 * @class
 */
export default class ModuleOptionsGenerate {
  protected readonly options: ModuleOptionType[] = [];

  /**
   * Group module options into an object.
   * @param valueFieldName - The value filed name.
   * @returns The object grouping a module option.
   */
  protected convertToKeyValueObject(valueFieldName: ValueFieldNameType): ModuleOptionsType {
    return this.options.reduce((obj, option) => {
      obj[option.name] = option[valueFieldName];
      return obj;
    }, {}) as ModuleOptionsType;
  }
}

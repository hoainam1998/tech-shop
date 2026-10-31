import {
  duplicateOptionError,
  exceedNumberOptionCanBeRegisteredError,
  optionNameNotInOptionsError,
  valueNotInAllowedRange,
  invalidOptionValueFieldName,
  invalidTypeOfOptionValue,
} from '@share/helpers/errors';

type ValueFieldNameType = 'token' | 'ttl';

type ModuleOptionType = Partial<{
  [key in ValueFieldNameType]: number;
}> & {
  name: string;
};

type ModuleOptionValidatePropsType = {
  options: ModuleOptionType[];
  min: number;
  max: number;
  valueFieldName: ValueFieldNameType;
  whiteList: string[];
  isRange: (value: number) => boolean;
};

const VALID_VALUE_FIELDNAME = ['ttl', 'token'];

export default ({ options, min, max, valueFieldName, whiteList, isRange }: ModuleOptionValidatePropsType) => {
  if (!VALID_VALUE_FIELDNAME.includes(valueFieldName)) {
    throw invalidOptionValueFieldName(valueFieldName, VALID_VALUE_FIELDNAME);
  }

  if (options.length > whiteList.length) {
    throw exceedNumberOptionCanBeRegisteredError;
  } else {
    const optionNameDuplicate = options
      .map((option) => option.name)
      .find((name, index, arr) => index !== arr.lastIndexOf(name));

    if (optionNameDuplicate) {
      throw duplicateOptionError(optionNameDuplicate);
    }

    options.forEach((option) => {
      if (!whiteList.includes(option.name)) {
        throw optionNameNotInOptionsError(option.name);
      }

      const value = option[valueFieldName]!;
      if (Number.isInteger(value) && value >= 0) {
        if (!isRange(value)) {
          throw valueNotInAllowedRange(value, min, max);
        }
      } else {
        throw invalidTypeOfOptionValue(valueFieldName);
      }
    });
  }
};

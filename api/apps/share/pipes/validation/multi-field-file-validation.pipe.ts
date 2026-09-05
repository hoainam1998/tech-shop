import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { MulterFieldsType, MultipleMulterFieldFiles } from '@share/interfaces';

const errors = {
  haveError: false,
  append(key: string, message) {
    if (this[key]) {
      this[key].push(message);
    } else {
      Object.defineProperty(this, key, {
        value: [message],
        writable: false,
        enumerable: true,
        configurable: false,
      });
    }
    this.haveError = true;
  },
  fromJson() {
    return Object.entries(this as object).reduce<Record<string, string[]>>((obj, [field, value]) => {
      if (Array.isArray(value)) {
        obj[field] = value;
      }
      return obj;
    }, {});
  },
};

@Injectable()
export default class MultiFieldFileValidationPipe implements PipeTransform {
  constructor(private readonly multipleFieldFileValidation: MulterFieldsType) {}

  transform(value: MultipleMulterFieldFiles) {
    const validateFileErrors = { ...errors };

    Object.entries(value).forEach(([field, files]) => {
      const rule = this.multipleFieldFileValidation[field];

      files.forEach((file) => {
        let validMimetype = false;

        if (typeof rule.allowedMimeTypes === 'string') {
          validMimetype = file.mimetype === rule.allowedMimeTypes;
        } else if (Array.isArray(rule)) {
          validMimetype = rule.includes(file.mimetype);
        } else {
          validMimetype = (rule.allowedMimeTypes as RegExp).test(file.mimetype);
        }

        if (!validMimetype) {
          validateFileErrors.append(field, `mimetype of ${file.originalname} is invalid!`);
        }

        if (file.size > rule.maxSizeInBytes) {
          validateFileErrors.append(field, `file size of ${file.originalname} exceed ${rule.maxSizeInBytes}!`);
        }

        if (file.size <= 10) {
          validateFileErrors.append(field, `${file.originalname} is empty!`);
        }
      });
    });

    if (validateFileErrors.haveError) {
      throw new BadRequestException(validateFileErrors.fromJson());
    }
    return value;
  }
}

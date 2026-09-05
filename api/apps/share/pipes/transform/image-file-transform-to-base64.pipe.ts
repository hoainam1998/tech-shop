import { PipeTransform, Injectable } from '@nestjs/common';
import { convertFileToBase64 } from '@share/utils';
import type { MultipleMulterFieldFiles } from '@share/interfaces';

const isMulterFile = (file: any): boolean => {
  return (
    file &&
    typeof file === 'object' &&
    typeof file.originalname === 'string' &&
    typeof file.mimetype === 'string' &&
    typeof file.fieldname === 'string'
  );
};

@Injectable()
export default class ImageTransformPipe implements PipeTransform {
  transform(value: Express.Multer.File | Express.Multer.File[] | MultipleMulterFieldFiles) {
    if (Array.isArray(value)) {
      return value.map((file) => convertFileToBase64(file));
    } else if (isMulterFile(value)) {
      return convertFileToBase64(value as Express.Multer.File);
    } else {
      return Object.entries(value as MultipleMulterFieldFiles).reduce((obj, [key, value]) => {
        obj[key] = value.map((file) => convertFileToBase64(file));
        return obj;
      }, {});
    }
  }
}

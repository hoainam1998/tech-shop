import { UploadedFiles } from '@nestjs/common';
import { ImageTransformPipe, MultiFieldFileValidationPipe } from '@share/pipes';
import { MulterFieldsType } from '@share/interfaces';

export default function UploadMultipleImages(fields: MulterFieldsType): ParameterDecorator {
  return UploadedFiles(new MultiFieldFileValidationPipe(fields), ImageTransformPipe);
}

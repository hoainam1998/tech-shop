import { BadRequestException, FileValidator, ParseFilePipeBuilder, UploadedFile } from '@nestjs/common';
import messages from '@share/constants/messages';
import { ImageTransformPipe, FileSizeValidationPipe } from '@share/pipes';
import { createMessage } from '@share/utils/message';

class SvgValidator extends FileValidator {
  isValid(file: Express.Multer.File): boolean {
    return file.mimetype === 'image/svg+xml';
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return messages.COMMON.IMAGE_IS_NOT_SVG.replace('{fieldname}', file.fieldname);
  }
}

export default function UploadSvgImage(fieldName: string): ParameterDecorator {
  return UploadedFile(
    new ParseFilePipeBuilder()
      .addValidator(new SvgValidator({}))
      .addMaxSizeValidator({ maxSize: 10000 })
      .build({
        exceptionFactory: (error) => {
          if (error === 'File is required') {
            throw new BadRequestException(
              createMessage(messages.COMMON.FILE_IS_MISSING.replace('{fieldname}', fieldName)),
            );
          }
          throw new BadRequestException(createMessage(error));
        },
      }),
    new FileSizeValidationPipe(),
    ImageTransformPipe,
  );
}

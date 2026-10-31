import { BadRequestException, ParseFilePipeBuilder, UploadedFile } from '@nestjs/common';
import messages from '@share/constants/messages';
import { FileSizeValidationPipe, ImageTransformPipe } from '@share/pipes';
import { createMessages } from '@share/utils/message';

export default function UploadImage(fieldName: string): ParameterDecorator {
  return UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: /image\/(jpeg|jpg|png)/ })
      .addMaxSizeValidator({ maxSize: 100000 })
      .build({
        exceptionFactory: (error) => {
          if (error === 'File is required') {
            throw new BadRequestException(
              createMessages(messages.COMMON.FILE_IS_MISSING.replace('{fieldname}', fieldName)),
            );
          }
          throw new BadRequestException(createMessages(error));
        },
      }),
    new FileSizeValidationPipe(),
    ImageTransformPipe,
  );
}

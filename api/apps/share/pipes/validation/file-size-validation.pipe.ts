import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { createMessage } from '@share/utils/message';
import messages from '@share/constants/messages';

@Injectable()
export default class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    if (value.size > 10) {
      return value;
    }
    throw new BadRequestException(createMessage(messages.COMMON.EMPTY_FILE.replace(/{fieldname}/, value.fieldname)));
  }
}

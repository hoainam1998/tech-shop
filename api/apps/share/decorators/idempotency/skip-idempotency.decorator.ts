import { SetMetadata } from '@nestjs/common';

export const META_NAME = 'skip_idempotency';

export default SetMetadata(META_NAME, true);

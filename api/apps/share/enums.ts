export enum TENANT_NAME {
  PUBLIC = 'public',
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee',
}

export enum PRISMA_ERROR_CODE {
  NOT_FOUND = 'P2025',
  DATABASE_LOST_CONNECT = 'P1001',
  ALREADY_EXIST = 'P2002',
  DO_NOT_HAVE_PERMISSION = 'P2039',
}

export enum ENTITY_SERVICE_NAME {
  CATEGORY = 'CATEGORY',
}

export enum REDIS_SUBSCRIBE_NAME {
  KEY_EVENT_EXPIRED = '__keyevent@0__:expired',
}

export enum QUEUE_NAME {
  EVENT_SOURCE = 'event_source',
  LOGGING = 'logging',
  CACHING = 'caching',
  MAILING = 'mailing',
}

export enum JOB_NAME {
  CATEGORY_MUTATION = 'category_mutation',
  LOGGING = 'logging',
  CATEGORY_CACHING = 'category_caching',
  MAILING = 'mailing',
}

export enum EVENT_NAME {
  CATEGORY_CREATED_EVENT = 'category_created_event',
  CATEGORY_UPDATED_EVENT = 'category_updated_event',
}

export enum AGGREGATE_NAME {
  CATEGORY = 'category',
}

export enum REQUEST_HANDLING_STATUS {
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum IDEMPOTENCY_OPTION_NAME {
  MEDIUM = 'medium',
  SHORT = 'short',
}

export enum RATE_LIMITING_OPTION_NAME {
  MEDIUM = 'medium',
  LESS = 'less',
}

export enum THROTTLER_OPTION_NAME {
  LONG = 'long',
  MEDIUM = 'medium',
  SHORT = 'short',
}

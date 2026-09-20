export default Object.freeze({
  COMMON: {
    EMPTY_FILE: '{fieldname} is an empty file!',
    FILE_IS_MISSING: '{fieldname} is missing!',
    IMAGE_IS_NOT_SVG: '{fieldname} is not svg file!',
    MODULE_DISCONNECT: 'The module require is disconnect!',
    COMMON_ERROR: 'Something have broken. Please try again!',
    THROTTLER_ERROR: 'Too many requests!',
    MISS_TENANT: 'Tenant-Id header is missing!',
    INVALID_TENANT: 'Tenant-Id is invalid!',
    REQUEST_HANDLING: 'Your request are handling!',
    MISS_IDEMPOTENCY_KEY: "Header 'x-idempotency-key' is required for this request.",
    INVALID_IDEMPOTENCY_KEY: "Header 'x-idempotency-key' must be a UUID.",
  },
  DATABASE: {
    DATABASE_DISCONNECT: 'Database was disconnect. Please try again!',
    MUTATING_DATABASE_ERROR: 'Something error when working with your database!',
    ALREADY_EXIST: 'This record have been exist!',
    DO_NOT_HAVE_PERMISSION: 'You do not have permission!',
  },
  CATEGORY: {
    NOT_FOUND: 'The category item requirement is not found!',
    ADD_CATEGORY_SUCCESS: 'Add category was success!',
    UPDATE_CATEGORY_SUCCESS: 'Update category was success!',
    DELETE_CATEGORY_SUCCESS: 'Delete category was success!',
  },
});

import { xss, type XssSanitizerOptions } from 'express-xss-sanitizer';

const options: XssSanitizerOptions = {
  allowedTags: [],
  allowedKeys: ['oldPassword', 'password'],
  allowedAttributes: {},
};

export default xss(options);

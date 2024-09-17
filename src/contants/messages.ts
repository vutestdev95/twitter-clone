export enum USERS_MESSAGES {
  VALIDATION_ERRORS = 'Validation errors',
  EMAIL_EXISTS = 'Email already exists',
  EMAIL_IS_REQUIRED = 'Email is required',
  INVALID_EMAIL = 'Invalid email',
  NAME_IS_REQUIRED = 'Name is required',
  NAME_MUST_BE_STRING = 'Name must be a string',
  NAME_LENGTH = 'Name must be between 1 and 100 characters',
  PASSWORD_IS_REQUIRED = 'Password is required',
  PASSWORD_LENGTH = 'Password must be between 6 and 50 characters',
  PASSWORD_MUST_BE_STRONG = 'Password must be strong',
  PASSWORD_MUST_BE_STRING = 'Password must be a string',
  CONFIRM_PASSWORD_IS_REQUIRED = 'Password confirmation is required',
  CONFIRM_PASSWORD_MUST_BE_STRING = 'Password confirmation must be a string',
  CONFIRM_PASSWORD_MUST_MATCH = 'Passwords must match password confirmation',
  CONFIRM_PASSWORD_LENGTH = 'Password confirmation must be between 6 and 50 characters',
  CONFIRM_PASSWORD_MUST_BE_STRONG = 'Password confirmation must be strong',
  DATE_OF_BIRTH_MUST_BE_DATE = 'Date of birth must be a date'
}

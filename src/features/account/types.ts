export type ErrorCode =
  | 'registrationFailed'
  | 'conflictError'
  | 'invalidParameter'
  | 'unknownError';

export type CreateNewAccountStatus = {
  errorCode?: ErrorCode;
  success: boolean;
};

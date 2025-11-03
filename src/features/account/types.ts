export type CreateAccountErrorCode =
  | 'registrationFailed'
  | 'conflictError'
  | 'invalidParameter'
  | 'unknownError';

type NewAccountSuccess = {
  success: true;
};

type NewAccountFail = {
  errorCode: CreateAccountErrorCode;
  success: false;
};

export type CreateNewAccountStatus = NewAccountFail | NewAccountSuccess;

type SendSuccss = {
  success: true;
};

export type SendFail = {
  errorCode: 'UNKNOWN_ERROR';
  success: false;
};

export type SendVerificationStatus = SendSuccss | SendFail;

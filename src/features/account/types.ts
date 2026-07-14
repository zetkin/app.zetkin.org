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
  errorCode: 'unknownError';
  success: false;
};

export type SendVerificationStatus = SendSuccss | SendFail;

export type PasswordSuccess = {
  success: true;
};

type PasswordFail = {
  errorCode: 'unknownError';
  success: false;
};

export type PasswordResetStatus = PasswordFail | PasswordSuccess;

export type SetPasswordResetTokenStatus = {
  errorCode?: 'unknownError';
  success: boolean;
};

export const serializeError = (err: unknown) => {
  if (err instanceof Error) {
    if (err.message === '') {
      return 'unknown error';
    }

    return err.message;
  }

  if (typeof err === 'string') {
    return err;
  }

  return JSON.stringify(err);
};

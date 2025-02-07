import { EmailVariable } from '../types';

export const inlineVariables: Record<string, EmailVariable> = {
  first_name: EmailVariable.FIRST_NAME,
  full_name: EmailVariable.FULL_NAME,
  last_name: EmailVariable.LAST_NAME,
};

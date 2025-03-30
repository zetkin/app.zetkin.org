import { VariableName } from '../extensions/VariableExtension';
import { EmailVariable } from '../types';

export const remirrorVarsToInlineVars: Record<VariableName, EmailVariable> = {
  first_name: EmailVariable.FIRST_NAME,
  full_name: EmailVariable.FULL_NAME,
  last_name: EmailVariable.LAST_NAME,
};

export const inlineVarsToRemirrorVars: Record<EmailVariable, VariableName> = {
  [EmailVariable.FIRST_NAME]: 'first_name',
  [EmailVariable.FULL_NAME]: 'full_name',
  [EmailVariable.LAST_NAME]: 'last_name',
};

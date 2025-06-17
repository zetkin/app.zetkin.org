import { ImportProblem, ImportProblemKind } from './types';

const LEVEL_BY_PROBLEM_KIND: Record<ImportProblemKind, 'warning' | 'error'> = {
  INVALID_FORMAT: 'error',
  INVALID_ORG_COUNTRY: 'warning',
  MAJOR_CHANGE: 'warning',
  MISSING_ID_AND_NAME: 'error',
  NO_IMPACT: 'error',
  UNCONFIGURED_ID: 'warning',
  UNCONFIGURED_ID_AND_NAME: 'error',
  UNEXPECTED_ERROR: 'error',
  UNKNOWN_ERROR: 'error',
  UNKNOWN_PERSON: 'error',
};

export function levelForProblemKind(kind: ImportProblemKind) {
  return LEVEL_BY_PROBLEM_KIND[kind];
}

export function levelForProblem(problem: ImportProblem) {
  return levelForProblemKind(problem.kind);
}

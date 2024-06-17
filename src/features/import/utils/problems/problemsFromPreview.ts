import { ImportPreview, ImportPreviewProblemCode } from '../types';
import { ImportProblem, ImportProblemKind, ImportRowProblem } from './types';

export default function problemsFromPreview(
  preview: ImportPreview
): ImportProblem[] {
  const problems: ImportProblem[] = [];
  const summary = preview.stats.person.summary;

  const problemByKind: Record<string, ImportRowProblem> = {};

  function accumulateProblem(kind: ImportRowProblem['kind'], row: number) {
    const existing = problemByKind[kind];
    if (existing) {
      existing.indices.push(row);
    } else {
      problemByKind[kind] = {
        indices: [row],
        kind: kind,
      };
    }
  }

  // Check problems from server
  preview.problems.forEach((previewProblem) => {
    if (previewProblem.code == ImportPreviewProblemCode.UNKNOWN_OBJECT) {
      if (previewProblem.field == 'data.id') {
        accumulateProblem(
          ImportProblemKind.UNKNOWN_PERSON,
          previewProblem.index
        );
      }
    } else if (
      previewProblem.code == ImportPreviewProblemCode.MISSING_ID_AND_NAME
    ) {
      accumulateProblem(
        ImportProblemKind.MISSING_ID_AND_NAME,
        previewProblem.index
      );
    } else if (
      previewProblem.code == ImportPreviewProblemCode.UNEXPECTED_ERROR
    ) {
      accumulateProblem(
        ImportProblemKind.UNEXPECTED_ERROR,
        previewProblem.index
      );
    } else if (previewProblem.level == 'error') {
      // Unknown error (unknown warnings are ignored)
      accumulateProblem(ImportProblemKind.UNKNOWN_ERROR, previewProblem.index);
    }
  });

  // Check for major changes to fields
  Object.keys(summary.updated.byChangedField).forEach((fieldSlug) => {
    const fieldChanges = summary.updated.byChangedField[fieldSlug] || 0;
    const percentage = fieldChanges / summary.updated.total;

    if (percentage > 0.3) {
      problems.push({
        field: fieldSlug,
        kind: ImportProblemKind.MAJOR_CHANGE,
      });
    }
  });

  Object.values(problemByKind).forEach((problem) => problems.push(problem));

  // Check total number of impacted people (should be > 0)
  const totalImpact =
    summary.addedToOrg.total +
    summary.created.total +
    summary.tagged.total +
    summary.updated.total;

  if (problems.length == 0 && totalImpact == 0) {
    problems.push({
      kind: ImportProblemKind.NO_IMPACT,
    });
  }

  return problems;
}

import { Field, FIELD_PRESENTATION, PresentableField } from './Event';

const titleHeight = 14;
const fieldHeight = 18;
const containerBottomPadding = 4;
const spaceBetweenFields = 4;
const spaceRequiredForField = fieldHeight + spaceBetweenFields;

export function availableHeightByEvent(
  totalAvailableHeight: number,
  numberOfEvents: number
): Record<number, number> {
  const availableHeights: Record<number, number> = {};
  const actualPixels = totalAvailableHeight - (numberOfEvents - 1);

  for (let i = 0; i < numberOfEvents; i++) {
    const isFirstEvent = i === 0;

    availableHeights[i] = isFirstEvent
      ? actualPixels / numberOfEvents -
        titleHeight -
        containerBottomPadding -
        spaceBetweenFields
      : actualPixels / numberOfEvents;
  }

  return availableHeights;
}

export function numberOfFieldsThatCanBeShown(availableHeight: number): number {
  let fieldsThatCanBeShown = 0;
  let remainingSpace = availableHeight - titleHeight - containerBottomPadding;

  while (remainingSpace > spaceRequiredForField) {
    const nextRemainingSpace = remainingSpace - spaceRequiredForField;

    fieldsThatCanBeShown++;
    remainingSpace = nextRemainingSpace;
  }

  return fieldsThatCanBeShown;
}

export function allCollapsedPresentableFields(
  fieldGroups: PresentableField[][]
): PresentableField[] {
  const fields: Record<string, PresentableField> = {};

  fieldGroups.forEach((group) => {
    group.forEach((field) => {
      if (!(field.kind in fields)) {
        fields[field.kind] = field;
      }
    });
  });

  return Object.values(fields);
}

export function fieldsToPresent(
  fields: Field[],
  availableHeight: number
): PresentableField[] {
  const numberOfFieldsToShow = numberOfFieldsThatCanBeShown(availableHeight);

  let fieldPresentations: PresentableField[] = [];

  if (numberOfFieldsToShow === 0) {
    fieldPresentations = fields
      .filter((field) => field.requiresAction)
      .map((field) => ({
        ...field,
        presentation: FIELD_PRESENTATION.ICON_ONLY,
      }));
  } else {
    let remainingFieldsToShow = numberOfFieldsToShow;

    fields.forEach((field) => {
      const shouldBeCollapsed = field.requiresAction;

      if (remainingFieldsToShow === 0 && shouldBeCollapsed) {
        fieldPresentations.push({
          ...field,
          presentation: FIELD_PRESENTATION.ICON_ONLY,
        });
      } else if (remainingFieldsToShow > 0) {
        fieldPresentations.push({
          ...field,
          presentation: FIELD_PRESENTATION.WITH_LABEL,
        });

        remainingFieldsToShow--;
      }
    });
  }

  return fieldPresentations;
}

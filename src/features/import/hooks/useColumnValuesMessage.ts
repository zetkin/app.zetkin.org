import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

export default function useColumnValuesMessage(
  numberOfEmptyRows: number,
  uniqueValues: (string | number)[]
) {
  const messages = useMessages(messageIds);

  //TODO: Replace/refactor this using useCommaPlural when that is merged.
  let columnValuesMessage = '';

  if (numberOfEmptyRows > 0 && uniqueValues.length == 0) {
    columnValuesMessage = messages.configuration.mapping.messages.onlyEmpty({
      numEmpty: numberOfEmptyRows,
    });
  } else if (numberOfEmptyRows > 0 && uniqueValues.length == 1) {
    columnValuesMessage =
      messages.configuration.mapping.messages.oneValueAndEmpty({
        firstValue: uniqueValues[0],
        numEmpty: numberOfEmptyRows,
      });
  } else if (numberOfEmptyRows > 0 && uniqueValues.length == 2) {
    columnValuesMessage =
      messages.configuration.mapping.messages.twoValuesAndEmpty({
        firstValue: uniqueValues[0],
        numEmpty: numberOfEmptyRows,
        secondValue: uniqueValues[1],
      });
  } else if (numberOfEmptyRows > 0 && uniqueValues.length == 3) {
    columnValuesMessage =
      messages.configuration.mapping.messages.threeValuesAndEmpty({
        firstValue: uniqueValues[0],
        numEmpty: numberOfEmptyRows,
        secondValue: uniqueValues[1],
        thirdValue: uniqueValues[2],
      });
  } else if (numberOfEmptyRows > 0 && uniqueValues.length > 3) {
    columnValuesMessage =
      messages.configuration.mapping.messages.manyValuesAndEmpty({
        firstValue: uniqueValues[0],
        numEmpty: numberOfEmptyRows,
        numMoreValues: uniqueValues.length - 3,
        secondValue: uniqueValues[1],
        thirdValue: uniqueValues[2],
      });
  } else if (numberOfEmptyRows == 0 && uniqueValues.length == 1) {
    columnValuesMessage =
      messages.configuration.mapping.messages.oneValueNoEmpty({
        firstValue: uniqueValues[0],
      });
  } else if (numberOfEmptyRows == 0 && uniqueValues.length == 2) {
    columnValuesMessage =
      messages.configuration.mapping.messages.twoValuesNoEmpty({
        firstValue: uniqueValues[0],
        secondValue: uniqueValues[1],
      });
  } else if (numberOfEmptyRows == 0 && uniqueValues.length == 3) {
    columnValuesMessage =
      messages.configuration.mapping.messages.threeValuesNoEmpty({
        firstValue: uniqueValues[0],
        secondValue: uniqueValues[1],
        thirdValue: uniqueValues[2],
      });
  } else if (numberOfEmptyRows == 0 && uniqueValues.length > 3) {
    columnValuesMessage =
      messages.configuration.mapping.messages.manyValuesNoEmpty({
        firstValue: uniqueValues[0],
        numMoreValues: uniqueValues.length - 3,
        secondValue: uniqueValues[1],
        thirdValue: uniqueValues[2],
      });
  }

  return columnValuesMessage;
}

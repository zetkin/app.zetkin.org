import messageIds from '../l10n/messageIds';
import useColumn from './useColumn';
import { useMessages } from 'core/i18n';

export default function useColumnValuesMessage(
  column: (number | string | null)[]
): string {
  const messages = useMessages(messageIds);
  const { numberOfEmptyRows, uniqueValues } = useColumn(column);

  if (numberOfEmptyRows > 0 && uniqueValues.length == 0) {
    return messages.configuration.mapping.messages.onlyEmpty({
      numEmpty: numberOfEmptyRows,
    });
  }

  if (numberOfEmptyRows > 0 && uniqueValues.length == 1) {
    return messages.configuration.mapping.messages.oneValueAndEmpty({
      firstValue: uniqueValues[0],
      numEmpty: numberOfEmptyRows,
    });
  }

  if (numberOfEmptyRows > 0 && uniqueValues.length == 2) {
    return messages.configuration.mapping.messages.twoValuesAndEmpty({
      firstValue: uniqueValues[0],
      numEmpty: numberOfEmptyRows,
      secondValue: uniqueValues[1],
    });
  }

  if (numberOfEmptyRows > 0 && uniqueValues.length == 3) {
    return messages.configuration.mapping.messages.threeValuesAndEmpty({
      firstValue: uniqueValues[0],
      numEmpty: numberOfEmptyRows,
      secondValue: uniqueValues[1],
      thirdValue: uniqueValues[2],
    });
  }

  if (numberOfEmptyRows > 0 && uniqueValues.length > 3) {
    return messages.configuration.mapping.messages.manyValuesAndEmpty({
      firstValue: uniqueValues[0],
      numEmpty: numberOfEmptyRows,
      numMoreValues: uniqueValues.length - 3,
      secondValue: uniqueValues[1],
      thirdValue: uniqueValues[2],
    });
  }

  if (numberOfEmptyRows == 0 && uniqueValues.length == 1) {
    return messages.configuration.mapping.messages.oneValueNoEmpty({
      firstValue: uniqueValues[0],
    });
  }

  if (numberOfEmptyRows == 0 && uniqueValues.length == 2) {
    return messages.configuration.mapping.messages.twoValuesNoEmpty({
      firstValue: uniqueValues[0],
      secondValue: uniqueValues[1],
    });
  }

  if (numberOfEmptyRows == 0 && uniqueValues.length == 3) {
    return messages.configuration.mapping.messages.threeValuesNoEmpty({
      firstValue: uniqueValues[0],
      secondValue: uniqueValues[1],
      thirdValue: uniqueValues[2],
    });
  }

  if (numberOfEmptyRows == 0 && uniqueValues.length > 3) {
    return messages.configuration.mapping.messages.manyValuesNoEmpty({
      firstValue: uniqueValues[0],
      numMoreValues: uniqueValues.length - 3,
      secondValue: uniqueValues[1],
      thirdValue: uniqueValues[2],
    });
  }

  //if you pass an empty array this happens
  return '';
}

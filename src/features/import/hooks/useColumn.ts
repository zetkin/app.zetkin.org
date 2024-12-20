import { columnUpdate } from '../store';
import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from '../l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useMessages } from 'core/i18n';
import { Column, ColumnKind } from '../utils/types';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export interface Option {
  disabled: boolean;
  value: string;
  label: string;
}

export default function useColumn(orgId: number) {
  const dispatch = useAppDispatch();
  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const columns = pendingFile.sheets[pendingFile.selectedSheetIndex].columns;
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const customFields = useCustomFields(orgId).data ?? [];

  const updateColumn = (index: number, column: Column) => {
    dispatch(columnUpdate([index, column]));
  };

  const allSelectedColumns = columns.filter(
    (column) => column.selected && column.kind != ColumnKind.UNKNOWN
  );

  const selectedColumns = allSelectedColumns.filter(
    (column) => column.kind != ColumnKind.TAG
  );

  const optionAlreadySelected = (value: string) => {
    if (value == 'tag') {
      return false;
    }

    const exists = selectedColumns.find((column) => {
      if (column.kind == ColumnKind.FIELD) {
        return column.field == value.slice(6);
      }

      if (column.kind == ColumnKind.GENDER) {
        return column.field == value;
      }

      if (column.kind == ColumnKind.DATE) {
        return column.field == value.slice(5);
      }

      if (column.kind == ColumnKind.ENUM) {
        return column.field == value.slice(5);
      }
    });

    return !!exists;
  };

  const nativeFieldsOptions: Option[] = Object.values(NATIVE_PERSON_FIELDS)
    .filter((fieldSlug) => fieldSlug != 'id' && fieldSlug != 'ext_id')
    .map((fieldSlug) => ({
      disabled: false,
      label: globalMessages.personFields[fieldSlug](),
      value: `field:${fieldSlug}`,
    }));

  const customFieldsOptions: Option[] = customFields.map((field) => {
    const belongsToCurrentOrg = field.organization.id == orgId;
    const suborgsCanWrite = field.org_write == 'suborgs';
    const currentOrgCanWrite = belongsToCurrentOrg || suborgsCanWrite;
    const readOnly = !currentOrgCanWrite;
    const label = readOnly
      ? messages.configuration.mapping.messages.readOnlyField({
          title: field.title,
        })
      : field.title;

    if (field.type === CUSTOM_FIELD_TYPE.DATE) {
      return {
        disabled: readOnly,
        label,
        value: `date:${field.slug}`,
      };
    } else if (field.type == CUSTOM_FIELD_TYPE.ENUM && field.enum_choices) {
      return {
        disabled: readOnly,
        label,
        value: `enum:${field.slug}`,
      };
    } else {
      return {
        disabled: readOnly,
        label,
        value: `field:${field.slug}`,
      };
    }
  });

  const fieldOptions: Option[] = [
    ...nativeFieldsOptions,
    ...customFieldsOptions,
  ].sort((a, b) => a.label.localeCompare(b.label));

  return { fieldOptions, optionAlreadySelected, updateColumn };
}

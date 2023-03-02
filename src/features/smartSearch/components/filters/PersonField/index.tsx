import { MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FormEvent, useEffect } from 'react';

import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import FilterForm from '../../FilterForm';
import getCustomFields from 'features/smartSearch/fetching/getCustomFields';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import StyledTextInput from '../../inputs/StyledTextInput';
import TimeFrame from '../TimeFrame';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  NewSmartSearchFilter,
  OPERATION,
  PersonFieldFilterConfig,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.personField;

interface PersonFieldProps {
  filter:
    | SmartSearchFilterWithId<PersonFieldFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<PersonFieldFilterConfig>
      | ZetkinSmartSearchFilter<PersonFieldFilterConfig>
  ) => void;
  onCancel: () => void;
}

const DEFAULT_VALUE = 'none';

const PersonField = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: PersonFieldProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const fieldsQuery = useQuery(
    ['customFields', orgId],
    getCustomFields(orgId as string)
  );
  const fields = fieldsQuery.data || [];

  const filteredFields = fields.filter(
    (f) => f.type !== CUSTOM_FIELD_TYPE.JSON
  );

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<Partial<PersonFieldFilterConfig>>(initialFilter);

  const getField = (slug?: string) => fields.find((f) => f.slug === slug);

  const selectedField = getField(filter.config.field);

  useEffect(() => {
    if (fields.length) {
      setConfig({
        ...filter.config,
        field: filter.config.field || filteredFields[0]?.slug,
      });
    }
  }, [fields]);

  // submit if there is a field selected and if the search field is not blank if type is text / url
  const submittable =
    selectedField &&
    (selectedField.type === CUSTOM_FIELD_TYPE.DATE ||
      filter.config.search?.length);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (filter.config.field) {
      if (selectedField?.type === CUSTOM_FIELD_TYPE.DATE) {
        onSubmit({
          ...filter,
          config: {
            after: filter.config.after,
            before: filter.config.before,
            field: filter.config.field,
          },
        });
      } else {
        onSubmit({
          ...filter,
          config: {
            field: filter.config.field,
            search: filter.config.search,
          },
        });
      }
    }
  };

  const handleValueChange = (value: string) => {
    setConfig({ ...filter.config, search: value });
  };

  const handleFieldChange = (field: string) => {
    setConfig({
      ...filter.config,
      field: field,
    });
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    setConfig({
      field: filter.config.field,
      search: filter.config.search,
      ...range,
    });
  };

  function getFieldInput(type: CUSTOM_FIELD_TYPE | null): JSX.Element {
    const fieldSelect = selectedField ? (
      <StyledSelect
        onChange={(e) => handleFieldChange(e.target.value)}
        value={selectedField?.slug}
      >
        {filteredFields.map((f) => (
          <MenuItem key={f.slug} value={f.slug}>
            {f.title}
          </MenuItem>
        ))}
      </StyledSelect>
    ) : (
      <StyledSelect
        SelectProps={{
          renderValue: function getLabel() {
            return <Msg id={localMessageIds.fieldSelect.any} />;
          },
        }}
        value={DEFAULT_VALUE}
      >
        <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
          <Msg id={localMessageIds.edit.none} />
        </MenuItem>
      </StyledSelect>
    );

    if (!type || type == CUSTOM_FIELD_TYPE.JSON) {
      // Not relevant
      return <></>;
    } else {
      if (type == CUSTOM_FIELD_TYPE.DATE) {
        return (
          <Msg
            id={localMessageIds.edit.date}
            values={{
              fieldSelect,
              timeFrame: (
                <TimeFrame
                  filterConfig={{
                    after: filter.config.after,
                    before: filter.config.before,
                  }}
                  onChange={handleTimeFrameChange}
                />
              ),
            }}
          />
        );
      } else if (type == CUSTOM_FIELD_TYPE.URL) {
        return (
          <Msg
            id={localMessageIds.edit.url}
            values={{
              fieldSelect,
              freeTextInput: (
                <StyledTextInput
                  inputString={filter.config.search || ''} // for dynamic width
                  onChange={(e) => handleValueChange(e.target.value)}
                  value={filter.config.search || ''}
                />
              ),
            }}
          />
        );
      } else {
        return (
          <Msg
            id={localMessageIds.edit.text}
            values={{
              fieldSelect,
              freeTextInput: (
                <StyledTextInput
                  inputString={filter.config.search || ''} // for dynamic width
                  onChange={(e) => handleValueChange(e.target.value)}
                  value={filter.config.search || ''}
                />
              ),
            }}
          />
        );
      }
    }
  }

  return (
    <FilterForm
      disableSubmit={!submittable}
      onCancel={onCancel}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => <></>}
      renderSentence={() => (
        <Msg
          id={localMessageIds.inputString}
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                {Object.values(OPERATION).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={localMessageIds.addRemoveSelect[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            field: getFieldInput(selectedField?.type ?? null),
          }}
        />
      )}
    />
  );
};

export default PersonField;

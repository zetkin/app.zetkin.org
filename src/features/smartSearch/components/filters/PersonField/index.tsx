import { MenuItem } from '@mui/material';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FormEvent, useEffect } from 'react';

import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import FilterForm from '../../FilterForm';
import getCustomFields from 'features/smartSearch/fetching/getCustomFields';
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

  return (
    <FilterForm
      disableSubmit={!submittable}
      onCancel={onCancel}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => (
        <>
          <Msg id="misc.smartSearch.person_field.examples.one" />
          <br />
          <Msg id="misc.smartSearch.person_field.examples.two" />
        </>
      )}
      renderSentence={() => (
        <Msg
          id="misc.smartSearch.person_field.inputString"
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                {Object.values(OPERATION).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg
                      id={`misc.smartSearch.person_field.addRemoveSelect.${o}`}
                    />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            field: (
              <Msg
                id={`misc.smartSearch.field.edit.${
                  selectedField?.type || DEFAULT_VALUE
                }`}
                values={{
                  fieldSelect: selectedField ? (
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
                          return (
                            <Msg id="misc.smartSearch.field.fieldSelect.any" />
                          );
                        },
                      }}
                      value={DEFAULT_VALUE}
                    >
                      <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
                        <Msg id="misc.smartSearch.field.edit.none" />
                      </MenuItem>
                    </StyledSelect>
                  ),
                  freeTextInput: (
                    <StyledTextInput
                      inputString={filter.config.search || ''} // for dynamic width
                      onChange={(e) => handleValueChange(e.target.value)}
                      value={filter.config.search || ''}
                    />
                  ),
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
            ),
          }}
        />
      )}
    />
  );
};

export default PersonField;

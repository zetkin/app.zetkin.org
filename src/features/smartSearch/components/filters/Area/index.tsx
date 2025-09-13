import { FC, useState } from 'react';
import { Chip, MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import {
  AllInSuborgFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  AREA_OPERATOR,
  ZetkinSmartSearchFilter,
  AreaFilterConfig,
} from '../../types';
import StyledSelect from '../../inputs/StyledSelect';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import StyledItemSelect from '../../inputs/StyledItemSelect';
import useAreas from 'features/areas/hooks/useAreas';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';

type Props = {
  filter: SmartSearchFilterWithId<AreaFilterConfig> | NewSmartSearchFilter;
  onCancel: () => void;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<AreaFilterConfig>
      | ZetkinSmartSearchFilter<AreaFilterConfig>
  ) => void;
};

const Area: FC<Props> = ({ filter: initialFilter, onSubmit, onCancel }) => {
  const { orgId } = useNumericRouteParams();
  const areas = useAreas(orgId).data || [];
  const customFields = useCustomFields(orgId).data || [];
  console.log(areas, customFields);

  const { filter, setConfig, setOp } = useSmartSearchFilter<AreaFilterConfig>(
    initialFilter,
    {
      area: -1,
      field: '',
      operator: AREA_OPERATOR.IN,
    }
  );

  const lnglatFields =
    customFields.filter((e) => e.type == CUSTOM_FIELD_TYPE.LNGLAT) || [];
  const initialLnglatField: string =
    lnglatFields && lnglatFields?.length != 0 ? lnglatFields[0].slug : '';

  const withinOutsideSelect = (
    <StyledSelect
      defaultValue={AREA_OPERATOR.IN}
      onChange={(ev) => {
        setConfig({
          ...filter.config,
          operator: ev.target.value as AREA_OPERATOR,
        });
      }}
    >
      {Object.values(AREA_OPERATOR).map((o) => (
        <MenuItem key={o} value={o}>
          <Msg id={messageIds.filters.area.slice[o]} />
        </MenuItem>
      ))}
    </StyledSelect>
  );

  const areaSelect = (
    <StyledSelect
      defaultValue={areas[0]?.id}
      onChange={(ev) => {
        const areaId = parseInt(ev.target.value);
        setConfig({
          ...filter.config,
          area: areaId,
        });
      }}
    >
      {areas.map((area) => (
        <MenuItem key={area.id} value={area.id}>
          {area.title}
        </MenuItem>
      ))}
    </StyledSelect>
  );

  const lnglatFieldSelect = (
    <StyledSelect
      defaultValue={initialLnglatField}
      onChange={(ev) => {
        setConfig({
          ...filter.config,
          field: ev.target.value,
        });
      }}
    >
      {lnglatFields.map((field) => (
        <MenuItem key={field.slug} value={field.slug}>
          {field.title}
        </MenuItem>
      ))}
    </StyledSelect>
  );

  return (
    <FilterForm
      onCancel={() => onCancel()}
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmit(filter);
      }}
      renderExamples={() => (
        <>
          <Msg id={messageIds.filters.area.examples.one} />
          <br />
          <Msg id={messageIds.filters.area.examples.two} />
        </>
      )}
      renderSentence={() => {
        return (
          <Msg
            id={messageIds.filters.area.inputString}
            values={{
              areaSelect,
              lnglatFieldSelect,
              withinOutsideSelect,
            }}
          />
        );
      }}
    />
  );
};

export default Area;

import { FC } from 'react';
import { MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import {
  NewSmartSearchFilter,
  SmartSearchFilterWithId,
  AREA_OPERATOR,
  ZetkinSmartSearchFilter,
  AreaFilterConfig,
  OPERATION,
} from '../../types';
import StyledSelect from '../../inputs/StyledSelect';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
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

  const { filter, setConfig, setOp } = useSmartSearchFilter<AreaFilterConfig>(
    initialFilter,
    {
      area: 0,
      field: '',
      operator: AREA_OPERATOR.IN,
    }
  );

  const lnglatFields =
    customFields.filter((e) => e.type === CUSTOM_FIELD_TYPE.LNGLAT) || [];
  const initialLnglatField: string =
    lnglatFields && lnglatFields?.length !== 0 ? lnglatFields[0].slug : '';
  if (!filter.config.field) {
    setConfig({
      ...filter.config,
      field: initialLnglatField,
    });
  }

  const addRemoveSelect = (
    <StyledSelect
      onChange={(e) => setOp(e.target.value as OPERATION)}
      value={filter.op}
    >
      {Object.values(OPERATION).map((o) => (
        <MenuItem key={o} value={o}>
          <Msg id={messageIds.operators[o]} />
        </MenuItem>
      ))}
    </StyledSelect>
  );

  const withinOutsideSelect = (
    <StyledSelect
      defaultValue={AREA_OPERATOR.IN}
      onChange={(ev) => {
        setConfig({
          ...filter.config,
          operator: ev.target.value as AREA_OPERATOR,
        });
      }}
      value={filter.config.operator}
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
      onChange={(ev) => {
        const areaId = parseInt(ev.target.value);
        setConfig({
          ...filter.config,
          area: areaId,
        });
      }}
      value={filter.config.area}
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
      onChange={(ev) => {
        setConfig({
          ...filter.config,
          field: ev.target.value,
        });
      }}
      value={filter.config.field}
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
      disableSubmit={filter.config.area === 0}
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
              addRemoveSelect,
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

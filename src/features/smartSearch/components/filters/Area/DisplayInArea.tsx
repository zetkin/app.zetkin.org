import { FC } from 'react';
import { useMediaQuery } from '@mui/system';
import { Box, Chip, MenuItem } from '@mui/material';

import {
  AllInSuborgFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
  AREA_OPERATOR,
  AreaFilterConfig,
} from '../../types';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { useNumericRouteParams } from 'core/hooks';
import StyledSelect from '../../inputs/StyledSelect';
import useAreas from 'features/areas/hooks/useAreas';
import useCustomFields from 'features/profile/hooks/useCustomFields';

type Props = {
  filter: SmartSearchFilterWithId<AreaFilterConfig>;
};

const DisplayInArea: FC<Props> = ({ filter }) => {
  const { orgId } = useNumericRouteParams();
  const isDesktop = useMediaQuery('(min-width:600px');
  const areas = useAreas(orgId).data || [];
  const customFields = useCustomFields(orgId).data || [];

  const op = filter.op || AREA_OPERATOR.IN;

  console.log(filter);

  return (
    <Msg
      id={messageIds.filters.area.inputString}
      values={{
        areaSelect: (
          <span>
            {areas.find((e) => e.id == filter.config.area)?.title ?? 'HUH!'}
          </span>
        ),
        lnglatFieldSelect: (
          <span>
            {customFields.find((e) => e.slug == filter.config.field)?.title ??
              'HUH!'}
          </span>
        ),
        withinOutsideSelect: (
          <Msg id={messageIds.filters.area.slice[filter.config.operator]} />
        ),
      }}
    />
  );
};

export default DisplayInArea;

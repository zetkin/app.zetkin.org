import { FC } from 'react';

import {
  SmartSearchFilterWithId,
  AreaFilterConfig,
  OPERATION,
} from '../../types';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useAreas from 'features/areas/hooks/useAreas';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';

type Props = {
  filter: SmartSearchFilterWithId<AreaFilterConfig>;
};

const DisplayInArea: FC<Props> = ({ filter }) => {
  const { orgId } = useNumericRouteParams();
  const areas = useAreas(orgId).data || [];
  const customFields = useCustomFields(orgId).data || [];

  const op = filter.op || OPERATION.ADD;

  return (
    <Msg
      id={messageIds.filters.area.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        areaSelect: (
          <UnderlinedText
            text={areas.find((e) => e.id === filter.config.area)?.title}
          />
        ),
        lnglatFieldSelect: (
          <UnderlinedText
            text={
              customFields.find((e) => e.slug === filter.config.field)?.title
            }
          />
        ),
        withinOutsideSelect: (
          <UnderlinedMsg
            id={messageIds.filters.area.slice[filter.config.operator]}
          />
        ),
      }}
    />
  );
};

export default DisplayInArea;

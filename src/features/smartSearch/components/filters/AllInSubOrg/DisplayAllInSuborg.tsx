import { FC } from 'react';
import { useMediaQuery } from '@mui/system';
import { Box, Chip } from '@mui/material';

import {
  AllInSuborgFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from '../../types';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { useNumericRouteParams } from 'core/hooks';

type Props = {
  filter: SmartSearchFilterWithId<AllInSuborgFilterConfig>;
};

const DisplayAllInSuborg: FC<Props> = ({ filter }) => {
  const { orgId } = useNumericRouteParams();
  const isDesktop = useMediaQuery('(min-width:600px');
  const suborgs = useSubOrganizations(orgId).data || [];
  const activeSuborgs = suborgs.filter((org) => org.is_active);

  const op = filter.op || OPERATION.ADD;

  if (filter.config.organizations == 'suborgs') {
    return (
      <Msg
        id={messageIds.filters.allInSuborg.inputString.any}
        values={{
          addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
          suborgScopeSelect: (
            <UnderlinedMsg
              id={messageIds.filters.allInSuborg.suborgScopeSelect.any}
            />
          ),
        }}
      />
    );
  } else if (
    Array.isArray(filter.config.organizations) &&
    filter.config.organizations.length == 1
  ) {
    const selectedSuborg = activeSuborgs.find(
      (suborg) => suborg.id == filter.config.organizations[0]
    );
    return (
      <Msg
        id={messageIds.filters.allInSuborg.inputString.single}
        values={{
          addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
          singleSuborgSelect: <UnderlinedText text={selectedSuborg?.title} />,
          suborgScopeSelect: (
            <UnderlinedMsg
              id={messageIds.filters.allInSuborg.suborgScopeSelect.single}
            />
          ),
        }}
      />
    );
  } else if (
    Array.isArray(filter.config.organizations) &&
    filter.config.organizations.length > 1
  ) {
    const orgIds = filter.config.organizations;
    const selectedSuborgs = activeSuborgs.filter((suborg) =>
      orgIds.includes(suborg.id)
    );

    return (
      <Msg
        id={messageIds.filters.allInSuborg.inputString.multiple}
        values={{
          addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
          multipleSuborgsSelect: (
            <Box
              alignItems="start"
              display="inline-flex"
              sx={{ marginTop: isDesktop ? '10px' : null }}
            >
              {selectedSuborgs.map((suborg) => (
                <Chip
                  key={suborg.id}
                  label={suborg.title}
                  size="small"
                  sx={{ margin: '2px' }}
                  variant="outlined"
                />
              ))}
            </Box>
          ),
          suborgScopeSelect: (
            <UnderlinedMsg
              id={messageIds.filters.allInSuborg.suborgScopeSelect.multiple}
            />
          ),
        }}
      />
    );
  } else {
    //If filter.config.organizations for some reason has the value "all"
    return null;
  }
};

export default DisplayAllInSuborg;

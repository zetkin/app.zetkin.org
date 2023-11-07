import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import AddedTagsTracker from './AddedTagsTracker';
import { getOrgsStates } from 'features/import/utils/getOrgsStates';
import ImportAlert from './importAlert';
import ImportChangeTracker from './importChangeTracker';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import useAlertsStates from 'features/import/hooks/useAlertsStates';
import { useNumericRouteParams } from 'core/hooks';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';
import {
  ZetkinCustomField,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';

export interface FakeDataType {
  summary: {
    createdPeople: {
      appliedTagsCreated: { [key: number]: number };
      organizationMembershipsCreated: { [key: number]: number };
      total: number;
    };
    updatedPeople: {
      appliedTagsCreated: { [key: number]: number };
      appliedTagsUpdated: { [key: number]: number };
      fields: {
        [key in
          | keyof Partial<ZetkinPersonNativeFields>
          | keyof Partial<ZetkinCustomField>]?: number;
      };
      organizationMembershipsCreated: { [key: number]: number };
      total: number;
    };
  };
}

interface ValidationProps {
  onClickBack: () => void;
  onDisabled: (value: boolean) => void;
}

const Validation = ({ onClickBack, onDisabled }: ValidationProps) => {
  const fake = {
    summary: {
      createdPeople: {
        appliedTagsCreated: {
          11: 20,
          9: 20,
        },
        organizationMembershipsCreated: {
          4: 10,
          7: 10,
        },
        total: 200,
      },
      updatedPeople: {
        appliedTagsCreated: {
          11: 20,
          12: 20,
        },
        appliedTagsUpdated: {
          2: 10,
        },
        fields: {
          date_of_birth: 12,
          email: 22,
          first_name: 21,
          join_date: 97,
          last_name: 11,
        },
        organizationMembershipsCreated: {
          1: 10,
          2: 10,
          4: 10,
          7: 10,
        },
        total: 100,
      },
    },
  };
  // const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
  const { orgId } = useNumericRouteParams();
  const alertStates = useAlertsStates(fake, onDisabled, onClickBack, orgId);

  const orgsStates = getOrgsStates(
    fake.summary.createdPeople.organizationMembershipsCreated,
    fake.summary.updatedPeople.organizationMembershipsCreated
  );

  return (
    <Box display="flex" mt={3}>
      <Box width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.pendingChanges} />
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <PeopleCounter
              changedNum={fake.summary.createdPeople.total}
              status={COUNT_STATUS.CREATED}
            />
            <PeopleCounter
              changedNum={fake.summary.updatedPeople.total}
              status={COUNT_STATUS.UPDATED}
            />
          </Stack>
          <ImportChangeTracker fields={fake.summary.updatedPeople.fields} />
          <AddedTagsTracker
            createdTags={fake.summary.createdPeople.appliedTagsCreated}
            updatedTags={fake.summary.updatedPeople.appliedTagsCreated}
          />
          <ImportChangeTracker orgsStates={orgsStates} />
        </Stack>
      </Box>
      <Box ml={2} width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.messages} />
        </Typography>
        <Stack spacing={2}>
          {alertStates.map((item, index) => {
            return (
              <Box key={`alert-${index}`}>
                <ImportAlert
                  msg={item.msg}
                  onClickBack={item?.onBack}
                  status={item.alertStatus}
                  title={item.title}
                />
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default Validation;

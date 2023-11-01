import { Box } from '@mui/system';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import { Typography } from '@mui/material';
import { ZetkinOrganization } from 'utils/types/zetkin';

interface ImportChangeTrackerProps {
  count: number;
  fieldName: string;
  orgs?: ZetkinOrganization[];
}
const ImportChangeTracker: React.FunctionComponent<
  ImportChangeTrackerProps
> = ({ count, fieldName, orgs }) => {
  if (orgs !== undefined && orgs.length === 0) {
    return null;
  }
  return (
    <Box sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}>
      <Box alignItems="center" display="flex">
        <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
          {count}
        </Typography>
        <Msg
          id={
            orgs
              ? messageIds.validation.trackers.orgs
              : messageIds.validation.trackers.defaultDesc
          }
        />
        <Typography fontWeight="bold" sx={{ ml: 0.5 }}>
          {fieldName}
        </Typography>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={0.5}>
        {orgs?.map((org) => (
          <Typography key={org.id} color="secondary">
            {org.title},
          </Typography>
        ))}
      </Box>
    </Box>
  );
};
export default ImportChangeTracker;

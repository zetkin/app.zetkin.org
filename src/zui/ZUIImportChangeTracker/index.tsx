import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { ZetkinOrganization } from 'utils/types/zetkin';

interface ZUIImportChangeTrackerProps {
  count: number;
  desc: string;
  fieldName: string;
  orgs?: ZetkinOrganization[];
}
const ZUIImportChangeTracker: React.FunctionComponent<
  ZUIImportChangeTrackerProps
> = ({ count, desc, fieldName, orgs }) => {
  if (orgs !== undefined && orgs.length === 0) {
    return null;
  }
  return (
    <Box sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}>
      <Box display="flex">
        <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
          {count}
        </Typography>
        <Typography>{desc}</Typography>
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
export default ZUIImportChangeTracker;

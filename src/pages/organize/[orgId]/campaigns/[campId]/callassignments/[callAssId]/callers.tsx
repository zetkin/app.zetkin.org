import { Close } from '@material-ui/icons';
import Fuse from 'fuse.js';
import { GetServerSideProps } from 'next';
import {
  Avatar,
  Box,
  Fade,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { DataGridPro, GridColDef, GridRowData } from '@mui/x-data-grid-pro';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useModel from 'core/useModel';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';

const useStyles = makeStyles((theme) => ({
  chip: {
    borderColor: theme.palette.grey[500],
    borderRadius: '1em',
    borderWidth: '1px',
    color: theme.palette.text.secondary,
    cursor: 'default',
    display: 'flex',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
    textOverflow: 'ellipsis',
  },
}));

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;

    return {
      props: {
        assignmentId: callAssId,
        campId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: [
      'misc.breadcrumbs',
      'layout.organize.callAssignment',
      'pages.organizeCallAssignment',
    ],
  }
);

interface AssignmentPageProps {
  assignmentId: string;
  campId: string;
  orgId: string;
}

const TagsCell = ({ tags }: { tags: ZetkinTag[] }) => {
  const classes = useStyles();

  return (
    <ZUIResponsiveContainer ssrWidth={200}>
      {(width) => {
        const maxTags = Math.floor(width / 100);
        const displayedTags = tags.slice(0, maxTags);
        const hiddenTags = tags.slice(maxTags);

        const tooltipTitle = hiddenTags.map((tag) => tag.title).join(', ');

        return (
          <Box alignItems="center" display="flex" width="100%">
            {displayedTags.map((tag) => (
              <TagChip key={tag.id} tag={tag} />
            ))}
            {hiddenTags.length > 0 && (
              <Tooltip title={tooltipTitle}>
                <Box border={2} className={classes.chip}>
                  {`${displayedTags.length > 0 ? '+' : ''}${hiddenTags.length}`}
                </Box>
              </Tooltip>
            )}
          </Box>
        );
      }}
    </ZUIResponsiveContainer>
  );
};

const filterRows = (rows: GridRowData[], searchString: string) => {
  if (!searchString) {
    return rows;
  }

  const fuse = new Fuse(rows, {
    includeScore: true,
    keys: ['name'],
    threshold: 0.4,
  });
  return fuse
    .search(searchString)
    .map((fuseResult) => fuseResult.item) as GridRowData[];
};

const AssignmentPage: PageWithLayout<AssignmentPageProps> = ({
  orgId,
  assignmentId,
}) => {
  const [onServer, setOnServer] = useState(true);
  const [searchString, setSearchString] = useState('');
  const isSearching = searchString.length > 0;
  const model = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );
  const intl = useIntl();

  useEffect(() => {
    setOnServer(false);
  }, []);

  if (onServer) {
    return null;
  }

  // Columns
  const columns: GridColDef[] = [
    {
      disableColumnMenu: true,
      field: 'id',
      headerName: ' ',
      renderCell: (params) => (
        <Avatar src={`/api/orgs/${orgId}/people/${params.id}/avatar`} />
      ),
      sortable: false,
    },
    {
      field: 'name',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeCallAssignment.callers.nameColumn',
      }),
    },
    {
      field: 'prioritizedTags',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeCallAssignment.callers.prioritizedTagsColumn',
      }),
      renderCell: (props) => {
        return <TagsCell tags={props.row.prioritizedTags} />;
      },
    },
    {
      field: 'excludedTags',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeCallAssignment.callers.excludedTagsColumn',
      }),
      renderCell: (props) => {
        return <TagsCell tags={props.row.excludedTags} />;
      },
    },
  ];

  //Rows
  const callers = model.getCallers();

  const callersAsRowData: GridRowData[] = Array.from(
    callers.map((caller) => ({
      excludedTags: caller.excluded_tags,
      id: caller.id,
      name: `${caller.first_name} ${caller.last_name}`,
      prioritizedTags: caller.prioritized_tags,
    }))
  );

  const rows = filterRows(callersAsRowData, searchString);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">
              <Msg id="pages.organizeCallAssignment.callers.title" />
            </Typography>
            <TextField
              InputProps={{
                endAdornment: (
                  <Fade in={isSearching}>
                    <IconButton onClick={() => setSearchString('')}>
                      <Close />
                    </IconButton>
                  </Fade>
                ),
              }}
              onChange={(evt) => {
                setSearchString(evt.target.value);
              }}
              placeholder="Search"
              value={searchString}
              variant="outlined"
            />
          </Box>
          <DataGridPro
            autoHeight
            columns={columns}
            disableColumnReorder
            disableColumnResize
            rows={rows}
            style={{
              border: 'none',
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

AssignmentPage.getLayout = function getLayout(page, props) {
  return (
    <CallAssignmentLayout
      assignmentId={props.assignmentId}
      campaignId={props.campId}
      orgId={props.orgId}
    >
      {page}
    </CallAssignmentLayout>
  );
};

export default AssignmentPage;

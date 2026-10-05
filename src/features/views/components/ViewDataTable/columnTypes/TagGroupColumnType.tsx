import { FC, useState } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Box, Paper, Popper, Typography } from '@mui/material';

import compareTags from 'features/tags/utils/compareTags';
import { IColumnType } from './';
import { ZetkinAppliedTag, ZetkinTag } from 'utils/types/zetkin';
import { ZetkinViewRow } from '../../types';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import useToggleDebounce from 'utils/hooks/useToggleDebounce';
import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';
import { Msg } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';

type TagGroupViewCell = ZetkinTag[] | null;

export default class TagGroupColumnType implements IColumnType {
  cellToString(cell: TagGroupViewCell): string {
    return cell ? cell.map((value) => value.title).join(' | ') : '';
  }

  getColDef(): Omit<GridColDef, 'field'> {
    const tags: (ZetkinTag | ZetkinAppliedTag)[] = [
      {
        color: null,
        description: 'People who organize',
        group: { title: 'Cohorts' },
        hidden: false,
        id: 1,
        organization: mockOrganization(),
        title: 'Vänsterpartiet Malmö',
        value: null,
        value_type: null,
      },
      {
        color: '#f76af7',
        description: 'People who organize',
        group: { title: 'Cohorts' },
        hidden: false,
        id: 1,
        organization: mockOrganization(),
        title: 'UK Carpenters Union Cohort',
        value: null,
        value_type: null,
      },
      {
        color: '#f2f542',
        description: '',
        group: { title: 'Cohorts' },
        hidden: false,
        id: 1,
        organization: mockOrganization(),
        title: 'Byggnads 2026',
        value: null,
        value_type: null,
      },
      {
        color: '#0735b3',
        description: '',
        group: { title: 'Cohorts' },
        hidden: false,
        id: 1,
        organization: mockOrganization(),
        title: '2026 Time Team',
        value: null,
        value_type: null,
      },
      {
        color: null,
        description: 'People who organize',
        group: { title: 'Cohorts' },
        hidden: false,
        id: 1,
        organization: mockOrganization(),
        title: 'Vänsterpartiet Malmö',
        value: null,
        value_type: null,
      },
      {
        color: '#f76af7',
        description: 'People who organize',
        group: { title: 'Cohorts' },
        hidden: false,
        id: 1,
        organization: mockOrganization(),
        title: 'UK Carpenters Union Cohort',
        value: null,
        value_type: null,
      },
      {
        color: '#f2f542',
        description: '',
        group: { title: 'Cohorts' },
        hidden: false,
        id: 1,
        organization: mockOrganization(),
        title: 'Byggnads 2026',
        value: null,
        value_type: null,
      },
      {
        color: '#0735b3',
        description: '',
        group: { title: 'Cohorts' },
        hidden: false,
        id: 1,
        organization: mockOrganization(),
        title: '2026 Time Team',
        value: null,
        value_type: null,
      },
    ];

    return {
      align: 'center',
      headerAlign: 'center',
      renderCell: (
        params: GridRenderCellParams<ZetkinViewRow, ZetkinAppliedTag>
      ) => (
        <Cell
          cellValue={params.value}
          personId={params.row.id}
          tags={tags || params.value}
        />
      ),
      sortComparator: (v1: ZetkinAppliedTag, v2: ZetkinAppliedTag) => {
        return compareTags(v1, v2);
      },
    };
  }

  getSearchableStrings(cell: TagGroupViewCell): string[] {
    return cell?.map((tag) => tag.title) || [];
  }
}

interface CellProps {
  cellValue: ZetkinAppliedTag | string | undefined;
  personId: number;
  tags: (ZetkinTag | ZetkinAppliedTag)[];
}

const Cell: FC<CellProps> = ({ tags }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { open: openPopper, close: closePopper } = useToggleDebounce(
    (ev) => setAnchorEl(ev.currentTarget),
    () => setAnchorEl(null)
  );

  if (tags.length === 0) {
    return null;
  }

  return (
    <ZUIResponsiveContainer ssrWidth={200}>
      {(width) => {
        const maxTags = Math.floor(width / 150);
        const displayedTags = tags.slice(0, maxTags);
        const hiddenTags = tags.slice(maxTags);

        return (
          <Box
            onMouseEnter={openPopper}
            onMouseLeave={closePopper}
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: 0.5,
              width: '100%',
            }}
          >
            <Popper anchorEl={anchorEl} open={!!anchorEl} placement="left">
              <Paper>
                <Box
                  sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    padding: 1,
                  }}
                >
                  <Typography variant="h5">
                    <Msg
                      id={messageIds.tagGroup.tagListHeader}
                      values={{ groupTitle: tags[0].group?.title || '' }}
                    />
                  </Typography>
                  {tags.map((tag) => (
                    <TagChip key={tag.id} disableTooltip tag={tag} />
                  ))}
                </Box>
              </Paper>
            </Popper>
            {displayedTags.map((tag) => (
              <TagChip key={tag.id} disableTooltip tag={tag} />
            ))}
            {hiddenTags.length > 0 && (
              <Box
                border={2}
                sx={(theme) => ({
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
                })}
              >
                {`${displayedTags.length > 0 ? '+' : ''}${hiddenTags.length}`}
              </Box>
            )}
          </Box>
        );
      }}
    </ZUIResponsiveContainer>
  );
};

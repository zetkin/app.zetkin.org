import { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  Box,
  Divider,
  Popover,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';
import { ExpandMore, MoreVert } from '@mui/icons-material';
import { FC, useState } from 'react';

import ZUIButton from 'zui/ZUIButton';
import ZUIButtonGroup from 'zui/ZUIButtonGroup';
import ZUIMenu, { MenuItem } from 'zui/ZUIMenu';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';

interface ZUIHeaderProps {
  actionButtonPopoverContent?: (onClose: () => void) => JSX.Element;
  actionButtonLabel?: string;
  actionButtonType?: 'primary' | 'secondary';
  belowActionButton?: JSX.Element;
  belowTitle?: JSX.Element;
  ellipsisMenuItems?: MenuItem[];
  metaData?: {
    icon: OverridableComponent<
      SvgIconTypeMap<Record<string, unknown>, 'svg'>
    > & { muiName: string };
    label: string;
  }[];
  onActionButtonClick?: () => void;
  onTitleChange?: (newValue: string) => void;
  title: string;
}

const ZUIHeader: FC<ZUIHeaderProps> = ({
  actionButtonPopoverContent,
  actionButtonLabel,
  actionButtonType = 'secondary',
  belowActionButton,
  belowTitle,
  ellipsisMenuItems,
  metaData,
  onActionButtonClick,
  onTitleChange,
  title,
}) => {
  const [ellipsisMenuAnchorEl, setEllipsisMenuAnchorEl] =
    useState<Element | null>(null);
  const [actionButtonPopoverAnchorEl, setactionButtonPopoverAnchorEl] =
    useState<Element | null>(null);

  return (
    <Box border={1} display="flex" justifyContent="space-between">
      <Box display="flex" flexDirection="column">
        <Typography
          component="div"
          noWrap
          sx={{
            display: 'flex',
            marginBottom: '8px',
            transition: 'margin 0.3s ease',
          }}
          variant="h4"
        >
          {onTitleChange ? (
            <ZUIEditTextinPlace
              onChange={(newValue) => onTitleChange(newValue)}
              value={title}
            />
          ) : (
            title
          )}
        </Typography>
        {(belowTitle || metaData) && (
          <Box display="flex">
            {belowTitle && belowTitle}
            {belowTitle && metaData && (
              <Divider
                flexItem
                orientation="vertical"
                sx={{ marginX: 1 }}
                variant="middle"
              />
            )}
            {metaData && (
              <ZUIIconLabelRow
                color="secondary"
                iconLabels={metaData.map((data) => {
                  const Icon = data.icon;
                  return {
                    icon: <Icon color="secondary" fontSize="inherit" />,
                    label: data.label,
                  };
                })}
                size="sm"
              />
            )}
          </Box>
        )}
      </Box>
      {actionButtonLabel && (
        <Box
          alignItems="flex-end"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <ZUIButtonGroup type={actionButtonType}>
            <ZUIButton
              endIcon={actionButtonPopoverContent ? <ExpandMore /> : undefined}
              label={actionButtonLabel}
              onClick={(ev) => {
                if (actionButtonPopoverContent) {
                  setactionButtonPopoverAnchorEl(ev.currentTarget);
                } else if (onActionButtonClick) {
                  onActionButtonClick();
                }
              }}
            />
            {!!actionButtonPopoverContent && (
              <Popover
                anchorEl={actionButtonPopoverAnchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                onClose={() => setactionButtonPopoverAnchorEl(null)}
                open={!!actionButtonPopoverAnchorEl}
              >
                {actionButtonPopoverContent(() =>
                  setactionButtonPopoverAnchorEl(null)
                )}
              </Popover>
            )}
            {!!ellipsisMenuItems?.length && (
              <>
                <ZUIButton
                  label={<MoreVert />}
                  onClick={(ev) =>
                    setEllipsisMenuAnchorEl(
                      ellipsisMenuAnchorEl ? null : ev.currentTarget
                    )
                  }
                />
                <ZUIMenu
                  anchorEl={ellipsisMenuAnchorEl}
                  menuItems={ellipsisMenuItems}
                  onClose={() => setEllipsisMenuAnchorEl(null)}
                />
              </>
            )}
          </ZUIButtonGroup>
          {belowActionButton && <Box>{belowActionButton}</Box>}
        </Box>
      )}
    </Box>
  );
};

export default ZUIHeader;

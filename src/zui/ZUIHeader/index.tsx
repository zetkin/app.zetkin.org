import { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  Avatar,
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
  avatar?: string;
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
  avatar,
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

  const showActionButton = !!actionButtonLabel;
  const showEllipsisMenu = !!ellipsisMenuItems?.length;
  const showBottomRow = belowTitle || metaData || belowActionButton;

  return (
    <Box>
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Box alignItems="center" display="flex">
            {avatar && (
              <Avatar
                src={avatar}
                sx={{
                  height: 32,
                  marginRight: 1,
                  width: 32,
                }}
              />
            )}
            <Typography
              component="div"
              noWrap
              sx={{
                display: 'flex',
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
          </Box>
        </Box>
        {showActionButton && (
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
            {showEllipsisMenu && (
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
        )}
      </Box>
      {showBottomRow && (
        <Box alignItems="center" display="flex" paddingTop={1}>
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
          {belowActionButton && (
            <Box marginLeft="auto">{belowActionButton}</Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ZUIHeader;

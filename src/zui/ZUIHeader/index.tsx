import { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  SvgIconTypeMap,
  Typography,
  useTheme,
} from '@mui/material';
import { ExpandMore, MoreVert } from '@mui/icons-material';
import { FC, useState } from 'react';

import { ZUIButtonProps } from 'zui/ZUIButton';
import ZUIButtonGroup from 'zui/ZUIButtonGroup';
import ZUIMenu, { MenuItem as MenuItemType } from 'zui/ZUIMenu';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIBreadcrumbs, { BreadcrumbTreeItem } from 'zui/ZUIBreadcrumbs';
import { WithRequired } from 'utils/types';
import { ZUIIconButtonProps } from 'zui/ZUIIconButton';

interface ZUIHeaderProps {
  /**
   * Either an array of menu items, to be displayed as a menu OR a function that returns a component that will be displayed in the popover.
   * If the action button should open a menu - send in menu items, not a whole component.
   */
  actionButtonPopoverContent?:
    | WithRequired<MenuItemType, 'startIcon'>[]
    | ((onClose: () => void) => JSX.Element);

  /**
   * The text on the action button
   */
  actionButtonLabel?: string;

  /**
   * Variant of actionbutton. Defaults to 'secondary'
   */
  actionButtonVariant?: 'primary' | 'secondary';

  /**The href to an avatar */
  avatar?: string;

  /**A component to be shown under the action button */
  belowActionButton?: JSX.Element;

  /**A component to be shown under the title */
  belowTitle?: JSX.Element;

  /**Send in the breadcrumbs and the breadcrumb widget will show them */
  breadcrumbs?: BreadcrumbTreeItem[];

  /**Start icon is required for each menu item */
  ellipsisMenuItems?: WithRequired<MenuItemType, 'startIcon'>[];

  /**Icon + text pairs to be shown under the title */
  metaData?: {
    icon: OverridableComponent<
      SvgIconTypeMap<Record<string, unknown>, 'svg'>
    > & { muiName: string };
    label: string;
  }[];

  /**
   * If the action button performs a direct action (not opens a popover), this is the callback to perform that action
   */
  onActionButtonClick?: () => void;

  /**
   * If you want the title to be editable, send in this callback
   */
  onTitleChange?: (newValue: string) => void;

  /**
   * The page title
   */
  title: string;
}

/**
 *  This is the header component that is shown at the top of each page. It is used in the layout files.
 */
const ZUIHeader: FC<ZUIHeaderProps> = ({
  actionButtonPopoverContent,
  actionButtonLabel,
  actionButtonVariant = 'secondary',
  belowActionButton,
  breadcrumbs,
  avatar,
  belowTitle,
  ellipsisMenuItems,
  metaData,
  onActionButtonClick,
  onTitleChange,
  title,
}) => {
  const theme = useTheme();
  const [ellipsisMenuAnchorEl, setEllipsisMenuAnchorEl] =
    useState<Element | null>(null);
  const [actionButtonPopoverAnchorEl, setactionButtonPopoverAnchorEl] =
    useState<Element | null>(null);

  const showActionButton = !!actionButtonLabel;
  const showEllipsisMenu = !!ellipsisMenuItems?.length;
  const showBottomRow = belowTitle || metaData || belowActionButton;

  const actionButtons: (ZUIButtonProps | ZUIIconButtonProps)[] = [];

  if (actionButtonLabel) {
    actionButtons.push({
      endIcon: actionButtonPopoverContent ? <ExpandMore /> : undefined,
      label: actionButtonLabel,
      onClick: (ev) => {
        if (actionButtonPopoverContent) {
          setactionButtonPopoverAnchorEl(ev.currentTarget);
        } else if (onActionButtonClick) {
          onActionButtonClick();
        }
      },
    });

    if (showEllipsisMenu) {
      actionButtons.push({
        icon: MoreVert,
        onClick: (ev) =>
          setEllipsisMenuAnchorEl(
            ellipsisMenuAnchorEl ? null : ev.currentTarget
          ),
      });
    }
  }

  return (
    <Box>
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Box alignItems="center" display="flex">
            {breadcrumbs && (
              <Box marginRight={avatar ? '1rem' : '0.75rem'}>
                <ZUIBreadcrumbs breadcrumbs={breadcrumbs} />
              </Box>
            )}
            {avatar && (
              <Avatar
                src={avatar}
                sx={{
                  height: '2rem',
                  marginRight: '0.75rem',
                  width: '2rem',
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
              variant="headingLg"
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
          <>
            <ZUIButtonGroup
              buttons={actionButtons}
              variant={actionButtonVariant}
            />
            {!!actionButtonPopoverContent && (
              <Popover
                anchorEl={actionButtonPopoverAnchorEl}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                onClose={() => setactionButtonPopoverAnchorEl(null)}
                open={!!actionButtonPopoverAnchorEl}
                transformOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}
              >
                {typeof actionButtonPopoverContent === 'function' &&
                  actionButtonPopoverContent(() =>
                    setactionButtonPopoverAnchorEl(null)
                  )}
                {typeof actionButtonPopoverContent !== 'function' && (
                  <Box minWidth="12.5rem">
                    <MenuList>
                      {actionButtonPopoverContent.map((item, index) => (
                        <MenuItem
                          key={index}
                          disabled={item.disabled}
                          divider={item.divider}
                          onClick={() => {
                            item.onClick();
                            setactionButtonPopoverAnchorEl(null);
                          }}
                        >
                          {item.startIcon && (
                            <ListItemIcon>{item.startIcon}</ListItemIcon>
                          )}
                          <ListItemText>{item.label}</ListItemText>
                          {item.endContent && (
                            <Typography
                              color="secondary"
                              variant="bodySmRegular"
                            >
                              {item.endContent}
                            </Typography>
                          )}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Box>
                )}
              </Popover>
            )}
            {showEllipsisMenu && (
              <ZUIMenu
                anchorEl={ellipsisMenuAnchorEl}
                menuItems={ellipsisMenuItems}
                onClose={() => setEllipsisMenuAnchorEl(null)}
              />
            )}
          </>
        )}
      </Box>
      {showBottomRow && (
        <Box alignItems="center" display="flex" paddingTop="0.25rem">
          {(belowTitle || metaData) && (
            <Box alignItems="center" display="flex">
              {belowTitle && belowTitle}
              {belowTitle && metaData && (
                <Divider
                  flexItem
                  orientation="vertical"
                  sx={{ height: '1.375rem', marginX: '1rem' }}
                  variant="middle"
                />
              )}
              {metaData && (
                <Box display="flex" flexShrink={0} gap="0.5rem">
                  {metaData.map((data) => {
                    const Icon = data.icon;
                    return (
                      <Box
                        key={data.label}
                        alignItems="center"
                        display="flex"
                        flexShrink="0"
                        gap="0.375rem"
                      >
                        <Icon
                          size="1.25rem"
                          sx={{ color: theme.palette.grey[400] }}
                        />
                        <Typography
                          color="secondary"
                          flexShrink="0"
                          variant="bodySmRegular"
                        >
                          {data.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
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

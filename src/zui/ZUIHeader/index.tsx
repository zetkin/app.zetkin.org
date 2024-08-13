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
import ZUIBreadcrumbs, { BreadcrumbTreeItem } from 'zui/ZUIBreadcrumbs';
import { WithRequired } from 'utils/types';
import ZUIMenuList from 'zui/ZUIMenuList';

interface ZUIHeaderProps {
  /**
   * Either an array of menu items, to be displayed as a menu OR a function that returns a component that will be displayed in the popover.
   * If the action button should open a menu - send in menu items, not a whole component.
   */
  actionButtonPopoverContent?:
    | WithRequired<MenuItem, 'startIcon'>[]
    | ((onClose: () => void) => JSX.Element);

  /**
   * The text on the action button
   */
  actionButtonLabel?: string;

  /**
   * Type of actionbutton. Defaults to 'secondary'
   */
  actionButtonType?: 'primary' | 'secondary';

  /**The href to an avatar */
  avatar?: string;

  /**A component to be shown under the action button */
  belowActionButton?: JSX.Element;

  /**A component to be shown under the title */
  belowTitle?: JSX.Element;

  /**Send in the breadcrumbs and the breadcrumb widget will show them */
  breadcrumbs?: BreadcrumbTreeItem[];

  /**Start icon is required for each menu item */
  ellipsisMenuItems?: WithRequired<MenuItem, 'startIcon'>[];

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
  actionButtonType = 'secondary',
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
          <Box alignItems="center" display="flex" gap={1}>
            {breadcrumbs && <ZUIBreadcrumbs breadcrumbs={breadcrumbs} />}
            {avatar && (
              <Avatar
                src={avatar}
                sx={{
                  height: 32,
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
                  <Box minWidth={200}>
                    <ZUIMenuList
                      menuItems={actionButtonPopoverContent.map((menuItem) => ({
                        ...menuItem,
                        onClick: () => {
                          menuItem.onClick();
                          setactionButtonPopoverAnchorEl(null);
                        },
                      }))}
                    />
                  </Box>
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

import NextLink from 'next/link';
import { Box, FormControlLabel, Link, Switch } from '@mui/material';
import { useState } from 'react';

import UserAutocomplete from 'features/user/components/UserAutocomplete';
import useAbsoluteUrl from 'utils/hooks/useAbsoluteUrl';
import { useNumericRouteParams } from 'core/hooks';
import useViewSharing from 'features/views/hooks/useViewSharing';
import ZUIAccessList from 'zui/ZUIAccessList';
import ZUIFutures from 'zui/ZUIFutures';
import ZUIInlineCopyToClipboard from 'zui/ZUIInlineCopyToClipBoard';
import ZUIScrollingContainer from 'zui/ZUIScrollingContainer';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';

const ShareViewDialogShareTab = () => {
  const messages = useMessages(messageIds);
  const { orgId, viewId } = useNumericRouteParams();
  const [showOfficials, setShowOfficials] = useState(true);
  const shareLinkUrl = useAbsoluteUrl(
    `/organize/${orgId}/people/lists/${viewId}/shared`
  );
  const { accessListFuture, officialsFuture, grantAccess, revokeAccess } =
    useViewSharing(orgId, viewId);

  return (
    <Box display="flex" flexDirection="column" gap={1} height="100%">
      <ZUIFutures
        futures={{ accessList: accessListFuture, officials: officialsFuture }}
      >
        {({ data: { accessList, officials } }) => (
          <>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
            >
              <Box>
                <Msg
                  id={messageIds.shareDialog.share.statusLabel}
                  values={{
                    collaborators: accessList.length,
                    officials: officials.length,
                  }}
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOfficials}
                    onChange={(ev) => setShowOfficials(ev.target.checked)}
                  />
                }
                label={<Msg id={messageIds.shareDialog.share.showOfficials} />}
                labelPlacement="start"
              />
            </Box>
            <ZUIScrollingContainer disableHorizontal flexGrow={1}>
              <ZUIAccessList
                accessList={accessList}
                officials={showOfficials ? officials : []}
                onChangeLevel={(userId, level) => grantAccess(userId, level)}
                onRevoke={(userId) => revokeAccess(userId)}
                orgId={orgId}
              />
            </ZUIScrollingContainer>
            <Box marginTop={1}>
              <UserAutocomplete
                getOptionDisabled={(user) =>
                  accessList.some((item) => item.user_id == user.id)
                }
                onSelect={(user) => {
                  if (user) {
                    grantAccess(user.id, 'readonly');
                  }
                }}
                orgId={orgId}
                placeholder={messages.shareDialog.share.addPlaceholder()}
              />
            </Box>
            <Box textAlign="right">
              <Msg
                id={messageIds.shareDialog.share.collabInstructions}
                values={{
                  viewLink: (
                    <ZUIInlineCopyToClipboard
                      alwaysShowIcon
                      copyText={shareLinkUrl}
                    >
                      <NextLink
                        href={`/organize/${orgId}/people/lists/${viewId}/shared`}
                        legacyBehavior
                        passHref
                      >
                        <Link>
                          <Msg id={messageIds.shareDialog.share.viewLink} />
                        </Link>
                      </NextLink>
                    </ZUIInlineCopyToClipboard>
                  ),
                }}
              />
            </Box>
          </>
        )}
      </ZUIFutures>
    </Box>
  );
};

export default ShareViewDialogShareTab;

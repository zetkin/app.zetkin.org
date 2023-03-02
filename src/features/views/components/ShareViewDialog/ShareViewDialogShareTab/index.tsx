import NextLink from 'next/link';
import { Box, FormControlLabel, Link, Switch } from '@mui/material';
import { FC, useRef, useState } from 'react';

import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';
import useAbsoluteUrl from 'utils/hooks/useAbsoluteUrl';
import ViewSharingModel from 'features/views/models/ViewSharingModel';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAccessList from 'zui/ZUIAccessList';
import ZUIFutures from 'zui/ZUIFutures';
import ZUIInlineCopyToClipboard from 'zui/ZUIInlineCopyToClipBoard';
import ZUIScrollingContainer from 'zui/ZUIScrollingContainer';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/views/l10n/messageIds';

interface ShareViewDialogShareTabProps {
  model: ViewSharingModel;
}

const ShareViewDialogShareTab: FC<ShareViewDialogShareTabProps> = ({
  model,
}) => {
  const messages = useMessages(messageIds);
  const selectInputRef = useRef<HTMLInputElement>();
  const [showOfficials, setShowOfficials] = useState(true);
  const shareLinkUrl = useAbsoluteUrl(
    `/organize/${model.orgId}/people/views/${model.viewId}/shared`
  );

  const accessFuture = model.getAccessList();
  const officialsFuture = model.getOfficials();

  return (
    <Box display="flex" flexDirection="column" gap={1} height="100%">
      <ZUIFutures
        futures={{ accessList: accessFuture, officials: officialsFuture }}
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
                onChangeLevel={(personId, level) =>
                  model.grantAccess(personId, level)
                }
                onRevoke={(personId) => model.revokeAccess(personId)}
                orgId={model.orgId}
              />
            </ZUIScrollingContainer>
            <Box marginTop={1}>
              <MUIOnlyPersonSelect
                getOptionDisabled={(person) =>
                  accessList.some((item) => item.person.id == person.id) ||
                  officials.some((item) => item.id == person.id)
                }
                getOptionExtraLabel={(person) => {
                  const accessItem = accessList.find(
                    (item) => item.person.id == person.id
                  );
                  if (accessItem) {
                    return messages.global.accessLevels[accessItem.level]();
                  }

                  const official = officials.find(
                    (item) => item.id == person.id
                  );
                  if (official) {
                    return messages.global.roles[official.role]();
                  }

                  return '';
                }}
                inputRef={selectInputRef}
                onChange={function (person: ZetkinPerson): void {
                  model.grantAccess(person.id, 'readonly');

                  // Blur and re-focus input to reset, so that user can type again to
                  // add another person, without taking their hands off the keyboard.
                  selectInputRef?.current?.blur();
                  selectInputRef?.current?.focus();
                }}
                placeholder={messages.shareDialog.share.addPlaceholder()}
                selectedPerson={null}
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
                        href={`/organize/${model.orgId}/people/views/${model.viewId}/shared`}
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

import { Box } from '@mui/material';
import { useIntl } from 'react-intl';
import { FC, useRef } from 'react';

import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';
import ViewSharingModel from 'features/views/models/ViewSharingModel';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAccessList from 'zui/ZUIAccessList';
import ZUIFuture from 'zui/ZUIFuture';

interface ShareViewDialogShareTabProps {
  model: ViewSharingModel;
}

const ShareViewDialogShareTab: FC<ShareViewDialogShareTabProps> = ({
  model,
}) => {
  const intl = useIntl();
  const selectInputRef = useRef<HTMLInputElement>();

  const accessFuture = model.getAccessList();

  return (
    <Box>
      <ZUIFuture future={accessFuture}>
        {(accessList) => (
          <>
            <ZUIAccessList
              list={accessList}
              onChangeLevel={(personId, level) =>
                model.grantAccess(personId, level)
              }
              orgId={model.orgId}
            />
            <MUIOnlyPersonSelect
              getOptionDisabled={(person) =>
                accessList.some((item) => item.person.id == person.id)
              }
              getOptionExtraLabel={(person) => {
                const accessItem = accessList.find(
                  (item) => item.person.id == person.id
                );
                if (accessItem) {
                  return intl.formatMessage({
                    id: `zui.accessList.levels.${accessItem.level}`,
                  });
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
              selectedPerson={null}
            />
          </>
        )}
      </ZUIFuture>
    </Box>
  );
};

export default ShareViewDialogShareTab;

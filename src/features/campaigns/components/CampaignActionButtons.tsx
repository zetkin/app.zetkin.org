import { Box } from '@mui/material';
import { Link } from '@mui/material';
import {
  AssignmentOutlined,
  CheckBoxOutlined,
  Delete,
  EmailOutlined,
  Event,
  HeadsetMic,
  Map,
  OpenInNew,
  Settings,
} from '@mui/icons-material';
import React, { useContext, useState } from 'react';

import CampaignDetailsForm from 'features/campaigns/components/CampaignDetailsForm';
import { DialogContent as CreateTaskDialogContent } from 'zui/ZUISpeedDial/actions/createTask';
import campaignMessageIds from '../l10n/messageIds';
import useCampaign from '../hooks/useCampaign';
import useCreateCampaignActivity from '../hooks/useCreateCampaignActivity';
import useCreateEmail from 'features/emails/hooks/useCreateEmail';
import useCreateEvent from 'features/events/hooks/useCreateEvent';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { Msg, useMessages } from 'core/i18n';
import useCreateAreaAssignment from 'features/areaAssignments/hooks/useCreateAreaAssignment';
import useFeature from 'utils/featureFlags/useFeature';
import { AREAS } from 'utils/featureFlags';
import areaAssignmentMessageIds from 'features/areaAssignments/l10n/messageIds';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';

enum CAMPAIGN_MENU_ITEMS {
  EDIT_CAMPAIGN = 'editCampaign',
  DELETE_CAMPAIGN = 'deleteCampaign',
  SHOW_PUBLIC_PAGE = 'showPublicPage',
}

interface CampaignActionButtonsProps {
  campaign: ZetkinCampaign;
}

const CampaignActionButtons: React.FunctionComponent<
  CampaignActionButtonsProps
> = ({ campaign }) => {
  const campaginMessages = useMessages(campaignMessageIds);
  const areaAssignmentMessages = useMessages(areaAssignmentMessageIds);
  const { orgId, campId } = useNumericRouteParams();
  const hasAreaAssignments = useFeature(AREAS);

  // Dialogs
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);

  const createAreaAssignment = useCreateAreaAssignment(orgId);
  const createEvent = useCreateEvent(orgId);
  const { createCallAssignment, createSurvey } = useCreateCampaignActivity(
    orgId,
    campId
  );
  const { deleteCampaign, updateCampaign } = useCampaign(orgId, campaign.id);
  const { createEmail } = useCreateEmail(orgId);
  const themes = useEmailThemes(orgId).data || [];
  const configs = useEmailConfigs(orgId).data || [];

  const handleCreateEvent = () => {
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() + 1);
    defaultStart.setMinutes(0);
    defaultStart.setSeconds(0);
    defaultStart.setMilliseconds(0);

    const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);

    createEvent({
      activity_id: null,
      campaign_id: campaign.id,
      end_time: defaultEnd.toISOString(),
      location_id: null,
      start_time: defaultStart.toISOString(),
      title: null,
    });
  };

  const menuItems = [
    {
      icon: <Event />,
      label: campaginMessages.createButton.createEvent(),
      onClick: handleCreateEvent,
    },
    {
      icon: <HeadsetMic />,
      label: campaginMessages.createButton.createCallAssignment(),
      onClick: () =>
        createCallAssignment({
          title: campaginMessages.form.createCallAssignment.newCallAssignment(),
        }),
    },
    {
      icon: <AssignmentOutlined />,
      label: campaginMessages.createButton.createSurvey(),
      onClick: () =>
        createSurvey({
          signature: 'require_signature',
          title: campaginMessages.form.createSurvey.newSurvey(),
        }),
    },
    {
      icon: <CheckBoxOutlined />,
      label: campaginMessages.createButton.createTask(),
      onClick: () => setCreateTaskDialogOpen(true),
    },
  ];

  if (hasAreaAssignments) {
    menuItems.push({
      icon: <Map />,
      label: campaginMessages.createButton.createAreaAssignment(),
      onClick: () =>
        createAreaAssignment({
          campaign_id: campaign.id,
          instructions: '',
          metrics: [
            {
              definesDone: true,
              description: '',
              kind: 'boolean',
              question:
                campaginMessages.form.createAreaAssignment.defaultQuestion(),
            },
          ],
          title: areaAssignmentMessages.default.title(),
        }),
    });
  }

  if (configs.length && themes.length > 0) {
    menuItems.push({
      icon: <EmailOutlined />,
      label: campaginMessages.createButton.createEmail(),
      onClick: () =>
        createEmail({
          campaign_id: campId,
          config_id: configs[0].id,
          theme_id: themes[0].id,
          title: campaginMessages.form.createEmail.newEmail(),
        }),
    });
  }

  return (
    <Box display="flex" gap={1}>
      <Box>
        <ZUIButtonMenu
          items={menuItems}
          label={campaginMessages.createButton.createActivity()}
        />
      </Box>
      <Box>
        <ZUIEllipsisMenu
          items={[
            {
              id: CAMPAIGN_MENU_ITEMS.EDIT_CAMPAIGN,
              label: (
                <>
                  <Settings />
                  <Msg id={campaignMessageIds.form.edit} />
                </>
              ),
              onSelect: () => setEditCampaignDialogOpen(true),
            },
            {
              id: CAMPAIGN_MENU_ITEMS.DELETE_CAMPAIGN,
              label: (
                <>
                  <Delete />
                  <Msg id={campaignMessageIds.form.deleteCampaign.title} />
                </>
              ),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: deleteCampaign,
                  title: campaginMessages.form.deleteCampaign.title(),
                  warningText: campaginMessages.form.deleteCampaign.warning(),
                });
              },
            },
            {
              id: CAMPAIGN_MENU_ITEMS.SHOW_PUBLIC_PAGE,
              label: (
                <>
                  <OpenInNew />
                  <Link
                    color="inherit"
                    display="flex"
                    href={`/o/${orgId}/projects/${campId}`}
                    sx={{ alignItems: 'center', gap: 1 }}
                    target="_blank"
                    underline="none"
                  >
                    {
                      <Msg
                        id={campaignMessageIds.singleProject.showPublicPage}
                      />
                    }
                  </Link>
                </>
              ),
              onSelect: () => {
                // Do nothing, but without this, the menu will not close
              },
            },
          ]}
        />
      </Box>
      <ZUIDialog
        onClose={() => setEditCampaignDialogOpen(false)}
        open={editCampaignDialogOpen}
        title={campaginMessages.form.edit()}
      >
        <CampaignDetailsForm
          campaign={campaign}
          onCancel={() => setEditCampaignDialogOpen(false)}
          onSubmit={(data) => {
            updateCampaign({ ...data });
            setEditCampaignDialogOpen(false);
          }}
        />
      </ZUIDialog>
      <ZUIDialog
        onClose={() => {
          setCreateTaskDialogOpen(false);
        }}
        open={createTaskDialogOpen}
        title={campaginMessages.form.createTask.title()}
      >
        <CreateTaskDialogContent
          closeDialog={() => {
            setCreateTaskDialogOpen(false);
          }}
        />
      </ZUIDialog>
    </Box>
  );
};

export default CampaignActionButtons;

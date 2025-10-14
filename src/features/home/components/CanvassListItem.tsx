'use client';

import { GroupWorkOutlined } from '@mui/icons-material';
import React, { useEffect, useMemo, useState } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';

import MyActivityListItem from './MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCampaign, ZetkinOrganization } from 'utils/types/zetkin';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { campaignLoad, campaignLoaded } from 'features/campaigns/store';
import { RemoteItem } from 'utils/storeUtils';
import { AppDispatch } from 'core/store';
import {
  organizationLoad,
  organizationLoaded,
} from 'features/organizations/store';

type Props = {
  activity: ZetkinAreaAssignment;
  href?: string;
};

const errorCatch = 'load-if-necessary-failed';

const useLoadIfNecessary = <
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType
>(
  remoteItem: RemoteItem<DataType> | undefined,
  dispatch: AppDispatch,
  hooks: {
    /**
     * Called when the item begins loading.
     * @returns {PayloadAction} The action to dispatch when the item is loading.
     */
    actionOnLoad: () => PayloadAction<OnLoadPayload>;

    /**
     * Called when the item loads successfully.
     * @returns {PayloadAction} The action to dispatch when the item has loaded.
     */
    actionOnSuccess: (item: DataType) => PayloadAction<OnSuccessPayload>;

    /**
     * The function that loads the item. Typically an API call.
     * @returns {Promise<DataType[]>}
     */
    loader: () => Promise<DataType>;
  }
): IFuture<DataType> => {
  const [futureState, setFutureState] = useState<IFuture<DataType>>({
    data: null,
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    const result = loadItemIfNecessary<
      DataType | typeof errorCatch,
      OnLoadPayload,
      OnSuccessPayload
    >(remoteItem, dispatch, {
      actionOnLoad: () => {
        setFutureState({
          data: null,
          error: null,
          isLoading: true,
        });
        return hooks.actionOnLoad();
      },
      actionOnSuccess: (data: DataType | typeof errorCatch) => {
        if (data === errorCatch) {
          // state updated by loader
          return (() => {}) as PayloadAction<OnSuccessPayload>;
        }

        setFutureState({
          data: data,
          error: null,
          isLoading: false,
        });
        return hooks.actionOnSuccess(data);
      },
      loader: async () => {
        try {
          return await hooks.loader();
        } catch (err) {
          setFutureState({
            data: null,
            error: err,
            isLoading: false,
          });
          return errorCatch;
        }
      },
    });

    setFutureState({
      data: result.data === errorCatch ? null : (result.data as DataType),
      error:
        result.error ||
        (result.data === errorCatch && new Error('unknown error')) ||
        (!result.data && !result.isLoading && new Error('not found')),
      isLoading: result.isLoading,
    });
  }, [
    remoteItem,
    dispatch,
    hooks.actionOnLoad,
    hooks.actionOnSuccess,
    hooks.loader,
  ]);

  return futureState;
};

const useCampaign = (orgId: number, campId: number) => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const campaignsSlice = useAppSelector((state) => state.campaigns);

  const campaignItem = useMemo(() => {
    const campaignItems = campaignsSlice.campaignList.items;

    return campaignItems.find((item) => item.id == campId);
  }, [orgId, campId, campaignsSlice]);

  const hooks = useMemo(
    () => ({
      actionOnLoad: () => campaignLoad(campId),
      actionOnSuccess: (data) => campaignLoaded(data),
      loader: () =>
        apiClient.get<ZetkinCampaign>(`/api/orgs/${orgId}/campaigns/${campId}`),
    }),
    [campId, orgId]
  );

  return useLoadIfNecessary(campaignItem, dispatch, hooks);
};

const useOrganization = (orgId: number): IFuture<ZetkinOrganization> => {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const organizationState = useAppSelector((state) => state.organizations);

  const hooks = useMemo(
    () => ({
      actionOnLoad: () => organizationLoad(),
      actionOnSuccess: (data) => organizationLoaded(data),
      loader: () => apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
    }),
    [orgId]
  );

  return useLoadIfNecessary(organizationState.orgData, dispatch, hooks);
};

const CanvassListItem: React.FC<Props> = ({ href, activity }) => {
  const messages = useMessages(messageIds);
  const org = useOrganization(activity.organization_id);
  const proj = useCampaign(activity.organization_id, activity.project_id);

  const info = useMemo(
    () => [
      {
        Icon: GroupWorkOutlined,
        labels: [
          proj.isLoading || proj.error
            ? null
            : {
                href: `/o/${activity.organization_id}/projects/${activity.project_id}`,
                text: proj.data ? proj.data.title : `<${activity.project_id}>`,
              },
          {
            href: `/o/${activity.organization_id}/`,
            text: org.data ? org.data.title : `<${activity.organization_id}>`,
          },
        ].filter((label) => !!label),
      },
    ],
    [proj.data, org.data]
  );

  if (!org.data) {
    return null;
  }

  return (
    <MyActivityListItem
      actions={[
        <ZUIButton
          key="mainAction"
          href={href}
          label={messages.activityList.actions.areaAssignment()}
          size="large"
          variant="secondary"
        />,
      ]}
      description={activity.instructions}
      href={href}
      info={info}
      title={activity.title || messages.defaultTitles.areaAssignment()}
    />
  );
};

export default CanvassListItem;

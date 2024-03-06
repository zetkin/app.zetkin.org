import { EmailWithHtmlFrame } from '../types';
import getFrame from '../rpc/getFrame/client';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import useEmail from './useEmail';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { frameLoad, frameLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEmailWithFrame(
  orgId: number,
  emailId: number
): IFuture<EmailWithHtmlFrame> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { data: email, isLoading: emailIsLoading } = useEmail(orgId, emailId);

  const frameItems = useAppSelector((store) => store.emails.frameList.items);

  if (emailIsLoading) {
    return new LoadingFuture();
  }

  if (!email) {
    return new ErrorFuture('Email did not load.');
  }

  const frameItem = frameItems.find((item) => item.id === 1); // TODO: Use email.frame?.id

  /*
  if (!frameItem) {
    return { ...email, frame: {
      // TODO: Default frame here (no css, simple HTML)
    }};
  }
  */

  const frameFuture = loadItemIfNecessary(frameItem, dispatch, {
    actionOnLoad: () => frameLoad(1), // TODO: Use email.frame.id
    actionOnSuccess: (frame) => frameLoaded(frame),
    loader: () => apiClient.rpc(getFrame, { frameId: 1, orgId }), // TODO: Use email.frame.id
  });

  if (frameFuture.isLoading) {
    return new LoadingFuture();
  }

  if (!frameFuture.data || frameFuture.error) {
    return new ErrorFuture('Frame did not load.');
  }

  return new ResolvedFuture({ ...email, frame: frameFuture.data });
}

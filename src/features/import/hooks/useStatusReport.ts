import { ALERT_STATUS } from '../components/ImportDialog/Steps/ImportAlert';
import getAddedOrgsSummary from '../utils/getAddedOrgsSummary';
import messageIds from '../l10n/messageIds';
import { useAppSelector } from 'core/hooks';
import { useMessages } from 'core/i18n';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

interface Alert {
  status: ALERT_STATUS;
  msg: string;
  title: string;
}

export default function useStatusReport(
  orgId: number,
  status: 'error' | 'completed' | 'scheduled'
) {
  const message = useMessages(messageIds);
  const summary = useAppSelector((state) => state.import.importResult).summary;
  const tags = useTags(orgId).data ?? [];
  const organizations = useOrganizations().data ?? [];

  const { tagged, addedToOrg } = summary;

  const addedTags = Object.keys(tagged.byTag).reduce((acc: ZetkinTag[], id) => {
    const tag = tags.find((tag) => tag.id === parseInt(id));
    if (tag) {
      return acc.concat(tag);
    }
    return acc;
  }, []);

  const addedOrgsSummary = getAddedOrgsSummary(addedToOrg);
  const orgsWithNewPeople = organizations.filter((organization) =>
    addedOrgsSummary.orgs.some((orgId) => orgId == organization.id.toString())
  );

  let alert: Alert;

  if (status === 'error') {
    alert = {
      msg: message.importStatus.error.desc(),
      status: ALERT_STATUS.ERROR,
      title: message.importStatus.error.title(),
    };
  } else if (status === 'scheduled') {
    alert = {
      msg: message.importStatus.scheduled.desc(),
      status: ALERT_STATUS.INFO,
      title: message.importStatus.scheduled.title(),
    };
  } else {
    alert = {
      msg: message.importStatus.completed.desc(),
      status: ALERT_STATUS.SUCCESS,
      title: message.importStatus.completed.title(),
    };
  }

  return { addedTags, alert, orgsWithNewPeople, summary };
}

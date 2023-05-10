import { ApiFetch, createApiFetch } from 'utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/events/l10n/messageIds';
import { ZetkinViewFolder } from 'features/views/components/types';

interface LabeledBreadcrumbElement {
  href: string;
  label: string;
}

interface LocalizedBreadcrumbElement {
  href: string;
  labelMsg: string;
}

export type BreadcrumbElement =
  | LabeledBreadcrumbElement
  | LocalizedBreadcrumbElement;

const breadcrumbs = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { query, error } = validateQuery(req.query);

  if (query) {
    const { orgId, pathname } = query;

    if (!orgId) {
      return res.status(400).json({ error: 'orgId not provided' });
    }

    const apiFetch = createApiFetch(req.headers);
    const pathFields = pathname.split('/').slice(1);
    const breadcrumbs: BreadcrumbElement[] = [];
    const curPath = [];

    for (const field of pathFields) {
      if (field.startsWith('[') && field.endsWith(']')) {
        const fieldName = field.slice(1, -1);
        const fieldValue = query[fieldName];

        const elements = await fetchElements(
          '/' + curPath.join('/'),
          fieldName,
          fieldValue,
          orgId,
          req,
          apiFetch
        );
        elements.forEach((elem) => breadcrumbs.push(elem));
        curPath.push(fieldValue);
      } else {
        if (field == 'views' || field == 'folders') {
          // Ignore "views" and "folders", which are only there
          // for technical reasons, but do not represent any page
          // and shouldn't link to anything.
          continue;
        }
        curPath.push(field);
        breadcrumbs.push({
          href: '/' + curPath.join('/'),
          labelMsg: field,
        });
      }
    }
    res.status(200).json({ breadcrumbs });
  } else {
    return res.status(400).json({ error });
  }
};

async function fetchElements(
  basePath: string,
  fieldName: string,
  fieldValue: string,
  orgId: string,
  req: NextApiRequest,
  apiFetch: ApiFetch
): Promise<BreadcrumbElement[]> {
  if (fieldName == 'folderId') {
    const folders = await apiFetch(`/orgs/${orgId}/people/view_folders`)
      .then((res) => res.json())
      .then((envelope) => envelope.data as ZetkinViewFolder[]);

    const ancestors: ZetkinViewFolder[] = [];
    let nextAncestor = folders.find(
      (folder) => folder.id == parseInt(fieldValue)
    );
    while (nextAncestor) {
      ancestors.push(nextAncestor);
      const parent = nextAncestor.parent;
      nextAncestor = parent
        ? folders.find((folder) => folder.id == parent.id)
        : undefined;
    }

    return ancestors.reverse().map((folder) => ({
      href: basePath + '/' + folder.id,
      label: folder.title,
    }));
  } else {
    const label = await fetchLabel(fieldName, fieldValue, orgId, req, apiFetch);
    if (label) {
      return [
        {
          href: basePath + '/' + fieldValue,
          label: label,
        },
      ];
    } else {
      return [];
    }
  }
}

async function fetchLabel(
  fieldName: string,
  fieldValue: string,
  orgId: string,
  req: NextApiRequest,
  apiFetch: ApiFetch
): Promise<string | null> {
  const lang = getBrowserLanguage(req);
  const messages = await getServerMessages(lang, messageIds);

  if (fieldName === 'orgId') {
    const org = await apiFetch(`/orgs/${orgId}`).then((res) => res.json());
    return org.data.title;
  }
  if (fieldName === 'personId') {
    const person = await apiFetch(`/orgs/${orgId}/people/${fieldValue}`).then(
      (res) => res.json()
    );
    return `${person.data.first_name} ${person.data.last_name}`;
  }
  if (fieldName === 'campId') {
    if (fieldValue == 'standalone') {
      return null;
    } else {
      const campaign = await apiFetch(
        `/orgs/${orgId}/campaigns/${fieldValue}`
      ).then((res) => res.json());
      return campaign.data.title;
    }
  }
  if (fieldName === 'taskId') {
    const task = await apiFetch(`/orgs/${orgId}/tasks/${fieldValue}`).then(
      (res) => res.json()
    );
    return task.data.title;
  }
  if (fieldName == 'viewId') {
    const view = await apiFetch(
      `/orgs/${orgId}/people/views/${fieldValue}`
    ).then((res) => res.json());
    return view.data.title;
  }
  if (fieldName == 'instanceId') {
    const journeyInstance = await apiFetch(
      `/orgs/${orgId}/journey_instances/${fieldValue}`
    ).then((res) => res.json());
    return `${
      journeyInstance.data.title || journeyInstance.data.journey.title
    } #${journeyInstance.data.id}`;
  }
  if (fieldName == 'journeyId') {
    const journey = await apiFetch(
      `/orgs/${orgId}/journeys/${fieldValue}`
    ).then((res) => res.json());
    return journey.data.plural_label;
  }
  if (fieldName == 'callAssId') {
    const assignment = await apiFetch(
      `/orgs/${orgId}/call_assignments/${fieldValue}`
    ).then((res) => res.json());
    return assignment.data.title;
  }
  if (fieldName == 'surveyId') {
    const survey = await apiFetch(`/orgs/${orgId}/surveys/${fieldValue}`).then(
      (res) => res.json()
    );
    return survey.data.title;
  }
  if (fieldName == 'eventId') {
    const event = await apiFetch(`/orgs/${orgId}/actions/${fieldValue}`).then(
      (res) => res.json()
    );
    return (
      event.data.title || event.data.activity?.title || messages.type.untitled()
    );
  }

  return fieldValue;
}

const validateQuery = (
  query: NextApiRequest['query']
): {
  error?: string;
  query?: Record<string, string>;
} => {
  for (const key of Object.keys(query)) {
    if (typeof query[key] !== 'string') {
      return {
        error: 'Bad request',
      };
    }
  }
  if (!query.pathname) {
    return {
      error: 'Invalid path',
    };
  }
  const pathname = query.pathname as string;
  const pathFields = pathname.split('/').slice(1);
  for (const field of pathFields) {
    if (field.startsWith('[') && field.endsWith(']')) {
      const fieldName = field.slice(1, -1);
      if (!query[fieldName]) {
        return {
          error: 'Request missing parameters',
        };
      }
    }
  }
  return { query: query as Record<string, string> };
};

export default breadcrumbs;

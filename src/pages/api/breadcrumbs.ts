import { NextApiRequest, NextApiResponse } from 'next';

import { ApiFetch, createApiFetch } from 'utils/apiFetch';
import { isInteger } from 'utils/stringUtils';
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
          apiFetch
        );
        elements.forEach((elem) => breadcrumbs.push(elem));
        curPath.push(fieldValue);
      } else {
        if (field === 'callassignments' || field === 'surveys') {
          curPath.push(field);
          continue;
        } else if (field === 'folders' || field === 'lists') {
          // Ignore "views" and "folders" which are only there
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
    res.status(200).json({ data: breadcrumbs });
  } else {
    return res.status(400).json({ error });
  }
};

function unwrapEnvelope<T>(value: unknown): T | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const maybeEnvelope = value as { data?: unknown };
  return (maybeEnvelope.data ?? value) as T;
}

async function fetchElements(
  basePath: string,
  fieldName: string,
  fieldValue: string,
  orgId: string,
  apiFetch: ApiFetch
): Promise<BreadcrumbElement[]> {
  if (fieldName === 'orgId') {
    const orgRes = await apiFetch(`/orgs/${orgId}`).then((res) => res.json());
    const org = unwrapEnvelope<{ title?: string }>(orgRes);
    return [
      {
        href: basePath + '/' + fieldValue + '/projects',
        label: org?.title ?? '…',
      },
    ];
  } else if (fieldName === 'personId') {
    const personRes = await apiFetch(
      `/orgs/${orgId}/people/${fieldValue}`
    ).then((res) => res.json());
    const person =
      unwrapEnvelope<{ first_name?: string; last_name?: string }>(personRes);
    return [
      {
        href: basePath + '/' + fieldValue,
        label: `${person?.first_name ?? ''} ${person?.last_name ?? ''}`.trim(),
      },
    ];
  } else if (fieldName === 'campId') {
    // check if the value is a numeric ID, as `fieldValue` could also be passed as 'standalone' or 'shared'
    if (isInteger(fieldValue)) {
      const campaignRes = await apiFetch(
        `/orgs/${orgId}/campaigns/${fieldValue}`
      ).then((res) => res.json());
      const campaign = unwrapEnvelope<{ title?: string }>(campaignRes);
      return [
        {
          href: basePath + '/' + fieldValue,
          label: campaign?.title ?? '…',
        },
      ];
    }
  } else if (fieldName === 'taskId') {
    const taskRes = await apiFetch(`/orgs/${orgId}/tasks/${fieldValue}`).then(
      (res) => res.json()
    );
    const task = unwrapEnvelope<{ title?: string }>(taskRes);
    return [
      {
        href: basePath + '/' + fieldValue,
        label: task?.title ?? '…',
      },
    ];
  } else if (fieldName === 'viewId') {
    const viewRes = await apiFetch(
      `/orgs/${orgId}/people/views/${fieldValue}`
    ).then((res) => res.json());
    const view =
      unwrapEnvelope<{ folder?: { id?: number }; title?: string }>(viewRes);

    const folderId = view?.folder?.id;
    const folderElements = folderId
      ? await fetchFolders(folderId, basePath, orgId, apiFetch)
      : [];

    return [
      ...folderElements,
      {
        href: basePath + '/' + fieldValue,
        label: view?.title ?? '…',
      },
    ];
  } else if (fieldName === 'instanceId') {
    const journeyInstanceRes = await apiFetch(
      `/orgs/${orgId}/journey_instances/${fieldValue}`
    ).then((res) => res.json());
    const journeyInstance = unwrapEnvelope<{
      id?: number | string;
      journey?: { title?: string };
      title?: string;
    }>(journeyInstanceRes);

    const labelTitle =
      journeyInstance?.title ?? journeyInstance?.journey?.title ?? '';
    const labelId = journeyInstance?.id ?? fieldValue;
    return [
      {
        href: basePath + '/' + fieldValue,
        label: `${labelTitle} #${labelId}`.trim(),
      },
    ];
  } else if (fieldName === 'journeyId') {
    const journeyRes = await apiFetch(
      `/orgs/${orgId}/journeys/${fieldValue}`
    ).then((res) => res.json());
    const journey = unwrapEnvelope<{ title?: string }>(journeyRes);
    return [
      {
        href: basePath + '/' + fieldValue,
        label: journey?.title ?? '…',
      },
    ];
  } else if (fieldName === 'callAssId') {
    const assignmentRes = await apiFetch(
      `/orgs/${orgId}/call_assignments/${fieldValue}`
    ).then((res) => res.json());
    const assignment = unwrapEnvelope<{ title?: string }>(assignmentRes);
    return [
      {
        href: basePath + '/' + fieldValue,
        label: assignment?.title ?? '…',
      },
    ];
  } else if (fieldName === 'surveyId') {
    const surveyRes = await apiFetch(
      `/orgs/${orgId}/surveys/${fieldValue}`
    ).then((res) => res.json());
    const survey = unwrapEnvelope<{ title?: string }>(surveyRes);
    return [
      {
        href: basePath + '/' + fieldValue,
        label: survey?.title ?? '…',
      },
    ];
  } else if (fieldName === 'eventId') {
    const eventRes = await apiFetch(
      `/orgs/${orgId}/actions/${fieldValue}`
    ).then((res) => res.json());
    const event =
      unwrapEnvelope<{ activity?: { title?: string }; title?: string }>(
        eventRes
      );
    if (event?.title || event?.activity?.title) {
      return [
        {
          href: basePath + '/' + fieldValue,
          label: event?.title || event?.activity?.title || '…',
        },
      ];
    } else {
      return [
        {
          href: basePath + '/' + fieldValue,
          labelMsg: 'untitledEvent',
        },
      ];
    }
  } else if (fieldName === 'folderId') {
    const folderId = parseInt(fieldValue);
    const folderElements = await fetchFolders(
      folderId,
      basePath,
      orgId,
      apiFetch
    );
    return folderElements;
  } else if (fieldName === 'emailId') {
    const emailRes = await apiFetch(`/orgs/${orgId}/emails/${fieldValue}`).then(
      (res) => res.json()
    );
    const email = unwrapEnvelope<{ title?: string }>(emailRes);
    return [
      {
        href: basePath + '/' + fieldValue,
        label: email?.title ?? '…',
      },
    ];
  }

  return [];
}

async function fetchFolders(
  folderId: number,
  basePath: string,
  orgId: string,
  apiFetch: ApiFetch
): Promise<BreadcrumbElement[]> {
  const folders = await apiFetch(`/orgs/${orgId}/people/view_folders`)
    .then((res) => res.json())
    .then((envelope) => envelope.data as ZetkinViewFolder[]);

  let nextAncestor = folders.find((folder) => folder.id === folderId);

  const ancestors: ZetkinViewFolder[] = [];

  while (nextAncestor) {
    ancestors.push(nextAncestor);
    const parent = nextAncestor.parent;
    nextAncestor = parent
      ? folders.find((folder) => folder.id === parent.id)
      : undefined;
  }

  return ancestors
    .reverse()
    .map((folder) => getFolderAsElement(folder, basePath));
}

const getFolderAsElement = (folder: ZetkinViewFolder, basePath: string) => {
  return {
    folderId: folder?.parent?.id,
    href: basePath + '/folders/' + folder.id,
    label: folder.title,
  };
};

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

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
        if (
          field == 'callassignments' ||
          field == 'folders' ||
          field == 'lists' ||
          field == 'surveys'
        ) {
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

async function fetchElements(
  basePath: string,
  fieldName: string,
  fieldValue: string,
  orgId: string,
  apiFetch: ApiFetch
): Promise<BreadcrumbElement[]> {
  if (fieldName === 'orgId') {
    const org = await apiFetch(`/orgs/${orgId}`).then((res) => res.json());
    return [
      {
        href: basePath + '/' + fieldValue,
        label: org.data.title,
      },
    ];
  } else if (fieldName === 'personId') {
    const person = await apiFetch(`/orgs/${orgId}/people/${fieldValue}`).then(
      (res) => res.json()
    );
    return [
      {
        href: basePath + '/' + fieldValue,
        label: `${person.data.first_name} ${person.data.last_name}`,
      },
    ];
  } else if (fieldName === 'campId') {
    // check if the value is a numeric ID, as `fieldValue` could also be passed as 'standalone' or 'shared'
    if (isInteger(fieldValue)) {
      const campaign = await apiFetch(
        `/orgs/${orgId}/campaigns/${fieldValue}`
      ).then((res) => res.json());
      return [
        {
          href: basePath + '/' + fieldValue,
          label: campaign.data.title,
        },
      ];
    }
  } else if (fieldName === 'taskId') {
    const task = await apiFetch(`/orgs/${orgId}/tasks/${fieldValue}`).then(
      (res) => res.json()
    );
    return [
      {
        href: basePath + '/' + fieldValue,
        label: task.data.title,
      },
    ];
  } else if (fieldName == 'viewId') {
    const view = await apiFetch(
      `/orgs/${orgId}/people/views/${fieldValue}`
    ).then((res) => res.json());

    const folderId = view.data?.folder?.id;
    const folderElements = folderId
      ? await fetchFolders(folderId, basePath, orgId, apiFetch)
      : [];

    return [
      ...folderElements,
      {
        href: basePath + '/' + fieldValue,
        label: view.data.title,
      },
    ];
  } else if (fieldName == 'instanceId') {
    const journeyInstance = await apiFetch(
      `/orgs/${orgId}/journey_instances/${fieldValue}`
    ).then((res) => res.json());
    return [
      {
        href: basePath + '/' + fieldValue,
        label: `${
          journeyInstance.data.title || journeyInstance.data.journey.title
        } #${journeyInstance.data.id}`,
      },
    ];
  } else if (fieldName == 'journeyId') {
    const journey = await apiFetch(
      `/orgs/${orgId}/journeys/${fieldValue}`
    ).then((res) => res.json());
    return [
      {
        href: basePath + '/' + fieldValue,
        label: journey.data.plural_label,
      },
    ];
  } else if (fieldName == 'callAssId') {
    const assignment = await apiFetch(
      `/orgs/${orgId}/call_assignments/${fieldValue}`
    ).then((res) => res.json());
    return [
      {
        href: basePath + '/' + fieldValue,
        label: assignment.data.title,
      },
    ];
  } else if (fieldName == 'surveyId') {
    const survey = await apiFetch(`/orgs/${orgId}/surveys/${fieldValue}`).then(
      (res) => res.json()
    );
    return [
      {
        href: basePath + '/' + fieldValue,
        label: survey.data.title,
      },
    ];
  } else if (fieldName == 'eventId') {
    const event = await apiFetch(`/orgs/${orgId}/actions/${fieldValue}`).then(
      (res) => res.json()
    );
    if (event.data.title || event.data.activity?.title) {
      return [
        {
          href: basePath + '/' + fieldValue,
          label: event.data.title || event.data.activity?.title,
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
  } else if (fieldName == 'folderId') {
    const folderId = parseInt(fieldValue);
    const folderElements = await fetchFolders(
      folderId,
      basePath,
      orgId,
      apiFetch
    );
    return folderElements;
  } else if (fieldName == 'emailId') {
    const email = await apiFetch(`/orgs/${orgId}/emails/${fieldValue}`).then(
      (res) => res.json()
    );
    return [
      {
        href: basePath + '/' + fieldValue,
        label: email.data.title,
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

  let nextAncestor = folders.find((folder) => folder.id == folderId);

  const ancestors: ZetkinViewFolder[] = [];

  while (nextAncestor) {
    ancestors.push(nextAncestor);
    const parent = nextAncestor.parent;
    nextAncestor = parent
      ? folders.find((folder) => folder.id == parent.id)
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

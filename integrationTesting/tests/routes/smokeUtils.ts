import { expect } from '@playwright/test';
import type {
  BrowserContext,
  ConsoleMessage,
  Page,
  Route,
} from '@playwright/test';
import fs from 'fs';
import Iron from '@hapi/iron';
import { sealData } from 'iron-session';
import path from 'path';

import type { NextWorkerFixtures } from '../../fixtures/next';
import ActivistTag from '../../mockData/orgs/KPD/tags/Activist';
import AllCustomFields from '../../mockData/orgs/KPD/people/views/AllMembers/fields';
import AllMembers from '../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../mockData/orgs/KPD/people/views/AllMembers/rows';
import ClaraZetkin from '../../mockData/orgs/KPD/people/ClaraZetkin';
import ClarasOnboarding from '../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../mockData/orgs/KPD';
import KPDMembershipSurvey from '../../mockData/orgs/KPD/surveys/MembershipSurvey';
import MemberOnboarding from '../../mockData/orgs/KPD/journeys/MemberOnboarding';
import Memberships from '../../mockData/orgs/KPD/Memberships';
import OrganizerTag from '../../mockData/orgs/KPD/tags/Organizer';
import ReferendumSignatures from '../../mockData/orgs/KPD/projects/ReferendumSignatures';
import RosaLuxemburg from '../../mockData/orgs/KPD/people/RosaLuxemburg';
import SpeakToFriend from '../../mockData/orgs/KPD/projects/ReferendumSignatures/tasks/SpeakToFriend';
import WelcomeNewMembers from '../../mockData/orgs/KPD/projects/WelcomeNewMembers';

const SESSION_PASSWORD = 'thisispasswordandshouldbelongerthan32characters';
const ORG_ID = KPD.id;
const AREA_ASSIGNMENT_ID = 1;
const AREA_ID = 1;
const CALL_ASSIGNMENT_ID = 1;
const CAMPAIGN_ID = ReferendumSignatures.id;
const EMAIL_ID = 1;
const EVENT_ID = 1;
const FOLDER_ID = 1;
const JOIN_FORM_ID = 1;
const CALL_BLOCKED_VIEW_ID = 2;

const areaAssignment = {
  end_date: null,
  id: AREA_ASSIGNMENT_ID,
  instructions: '',
  organization_id: ORG_ID,
  project_id: CAMPAIGN_ID,
  reporting_level: 'location',
  start_date: '2020-01-01',
  title: 'Canvass assignment',
};

const assignmentArea = {
  boundary: {
    coordinates: [
      [
        [13.37, 52.5],
        [13.38, 52.5],
        [13.38, 52.51],
        [13.37, 52.51],
        [13.37, 52.5],
      ],
    ],
    type: 'Polygon',
  },
  description: '',
  id: AREA_ID,
  organization_id: ORG_ID,
  title: 'Smoke area',
};

const callAssignment = {
  campaign: {
    id: CAMPAIGN_ID,
    title: ReferendumSignatures.title,
  },
  cooldown: 0,
  description: '',
  disable_caller_notes: false,
  end_date: null,
  expose_target_details: false,
  goal: {
    filter_spec: [],
    id: 2,
    title: 'Goal',
  },
  id: CALL_ASSIGNMENT_ID,
  instructions: '',
  organization: KPD,
  start_date: '2020-01-01',
  target: {
    filter_spec: [],
    id: 1,
    title: 'Target',
  },
  title: 'Smoke call assignment',
};

const email = {
  campaign: {
    id: CAMPAIGN_ID,
    title: ReferendumSignatures.title,
  },
  config: {
    config: {},
    id: 1,
    no_reply: false,
    organization: KPD,
    sender_email: 'info@example.com',
    sender_name: 'KPD',
  },
  content: JSON.stringify({ blocks: [] }),
  id: EMAIL_ID,
  locked: null,
  organization: KPD,
  processed: null,
  published: null,
  subject: 'Smoke email',
  target: {
    filter_spec: [],
    id: 1,
    title: 'Target',
  },
  theme: null,
  title: 'Smoke email',
  uuid: 'smoke-email',
};

const event = {
  activity: null,
  campaign: {
    id: CAMPAIGN_ID,
    title: ReferendumSignatures.title,
  },
  cancelled: null,
  contact: null,
  cover_file: null,
  end_time: '2030-01-01T12:00:00+00:00',
  id: EVENT_ID,
  info_text: 'Smoke event',
  location: null,
  num_participants_available: 0,
  num_participants_required: 10,
  organization: KPD,
  published: '2020-01-01T00:00:00+00:00',
  start_time: '2030-01-01T10:00:00+00:00',
  title: 'Smoke event',
};

const campaignSurvey = {
  ...KPDMembershipSurvey,
  campaign: {
    id: CAMPAIGN_ID,
    title: ReferendumSignatures.title,
  },
};

const folder = {
  id: FOLDER_ID,
  organization: KPD,
  title: 'Smoke folder',
};

const callBlockedView = {
  ...AllMembers,
  content_query: {
    filter_spec: [
      {
        config: {
          reason: 'organizer_action_needed',
        },
        type: 'call_blocked',
      },
    ],
    id: CALL_BLOCKED_VIEW_ID,
  },
  id: CALL_BLOCKED_VIEW_ID,
  title: 'People who need organizer action',
};

const callBlockedColumns = [
  {
    config: { field: 'first_name' },
    id: 4,
    title: 'First name',
    type: 'person_field',
  },
  {
    config: { field: 'last_name' },
    id: 5,
    title: 'Last name',
    type: 'person_field',
  },
  {
    config: { state: 'any' },
    id: 6,
    title: 'Organizer action',
    type: 'organizer_action',
  },
];

const joinForm = {
  description: '',
  embeddable: true,
  fields: ['first_name', 'last_name'],
  id: JOIN_FORM_ID,
  org_access: 'sameorg',
  organization: KPD,
  renderable: true,
  requires_email_verification: false,
  submit_token: 'join-form-token',
  tags: [],
  title: 'Smoke join form',
};

const location = {
  created: '2020-01-01T00:00:00+00:00',
  created_by_user_id: null,
  description: '',
  id: 1,
  latitude: 52.505,
  longitude: 13.375,
  num_estimated_households: 0,
  num_households_successful: null,
  num_households_visited: null,
  num_known_households: 0,
  num_successful_visits: 0,
  num_visits: 0,
  organization_id: ORG_ID,
  title: 'Smoke location',
  type: 'assignment',
};

export type SmokeRoute = {
  expectedStatus?: number;
  path: string | (() => Promise<string>);
  template: string;
};

function encodePathSegment(value: string) {
  return encodeURIComponent(value).replace(/\*/g, '%2A');
}

async function makeEmbeddedJoinFormPath() {
  const formData = await Iron.seal(
    {
      fields: [{ s: 'first_name' }, { s: 'last_name' }],
      formId: JOIN_FORM_ID,
      orgId: ORG_ID,
      token: joinForm.submit_token,
    },
    SESSION_PASSWORD,
    Iron.defaults
  );

  return `/o/${ORG_ID}/embedjoinform/${encodePathSegment(formData)}`;
}

function collectFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(entryPath);
    }
    return entry.isFile() ? [entryPath] : [];
  });
}

function normalizeTemplate(template: string): string {
  return template.replace(/\/+/g, '/') || '/';
}

function collectAppPageTemplates(): string[] {
  const appDir = path.join(process.cwd(), 'src', 'app');
  return collectFiles(appDir)
    .filter((filePath) => filePath.endsWith(`${path.sep}page.tsx`))
    .map((filePath) => {
      const relativePath = path.relative(appDir, filePath);
      const segments = relativePath
        .split(path.sep)
        .slice(0, -1)
        .filter((segment) => !segment.startsWith('('));

      return normalizeTemplate('/' + segments.join('/'));
    });
}

function collectPagesRouterTemplates(): string[] {
  const pagesDir = path.join(process.cwd(), 'src', 'pages');
  return collectFiles(pagesDir)
    .filter((filePath) => /\.(ts|tsx)$/.test(filePath))
    .filter((filePath) => {
      const relativePath = path.relative(pagesDir, filePath);
      return (
        !relativePath.startsWith(`api${path.sep}`) &&
        !relativePath.startsWith('_') &&
        relativePath !== '404.tsx'
      );
    })
    .map((filePath) => {
      const relativePath = path
        .relative(pagesDir, filePath)
        .replace(/\.(ts|tsx)$/, '');
      const segments = relativePath.split(path.sep);
      if (segments[segments.length - 1] === 'index') {
        segments.pop();
      }

      return normalizeTemplate('/' + segments.join('/'));
    });
}

export function collectPageRouteTemplates(): string[] {
  return Array.from(
    new Set([...collectAppPageTemplates(), ...collectPagesRouterTemplates()])
  ).sort();
}

type RouteBucket = 'authenticated' | 'public' | 'redirect';

const ROUTE_BUCKET_RULES: [pattern: string, bucket: RouteBucket][] = [
  ['/', 'redirect'],
  ['/login', 'redirect'],
  ['/logout', 'redirect'],
  ['/call/*', 'authenticated'],
  ['/canvass/*', 'authenticated'],
  ['/my/*', 'authenticated'],
  ['/organize/*', 'authenticated'],
  ['/verify/*', 'authenticated'],
  ['/legacy', 'public'],
  ['/lost-password', 'public'],
  ['/o/*', 'public'],
  ['/register', 'public'],
  ['/reset-password', 'public'],
];

function matchesBucketPattern(template: string, pattern: string): boolean {
  if (!pattern.endsWith('/*')) {
    return template === pattern;
  }

  const base = pattern.slice(0, -2);
  return template === base || template.startsWith(`${base}/`);
}

export function classifyTemplate(template: string): RouteBucket | null {
  const rule = ROUTE_BUCKET_RULES.find(([pattern]) =>
    matchesBucketPattern(template, pattern)
  );
  return rule ? rule[1] : null;
}

const ALL_PAGE_TEMPLATES = collectPageRouteTemplates();

function templatesForBucket(bucket: RouteBucket): string[] {
  return ALL_PAGE_TEMPLATES.filter(
    (template) => classifyTemplate(template) === bucket
  );
}

const ROUTE_PARAM_VALUES: Record<string, string> = {
  areaAssId: String(AREA_ASSIGNMENT_ID),
  areaId: String(AREA_ID),
  callAssId: String(CALL_ASSIGNMENT_ID),
  emailId: String(EMAIL_ID),
  eventId: String(EVENT_ID),
  folderId: String(FOLDER_ID),
  instanceId: String(ClarasOnboarding.id),
  journeyId: String(MemberOnboarding.id),
  orgId: String(ORG_ID),
  personId: String(ClaraZetkin.id),
  projId: String(CAMPAIGN_ID),
  projectId: String(CAMPAIGN_ID),
  surveyId: String(KPDMembershipSurvey.id),
  taskId: String(SpeakToFriend.id),
  themeId: '1',
  token: 'test-token',
  viewId: String(AllMembers.id),
};

function fillRouteTemplate(template: string): string {
  return template
    .split('/')
    .map((segment) => {
      const param = segment.match(/^\[(\w+)\]$/)?.[1];
      if (!param) {
        return segment;
      }

      const value = ROUTE_PARAM_VALUES[param];
      if (value === undefined) {
        throw new Error(
          `smokeUtils: no route param value configured for "${param}" (template: ${template})`
        );
      }

      return value;
    })
    .join('/');
}

type RouteOverride = {
  expectedStatus?: number;
  path?: SmokeRoute['path'];
};

const ROUTE_OVERRIDES: Record<string, RouteOverride> = {
  '/o/[orgId]/embedjoinform/[formData]': { path: makeEmbeddedJoinFormPath },
  '/o/[orgId]/unsubscribe': {
    path: `/o/${ORG_ID}/unsubscribe?unsub=${encodeURIComponent(
      'https://example.com/unsubscribe'
    )}`,
  },
};

function buildRoutes(templates: string[]): SmokeRoute[] {
  return templates.map((template) => {
    const override = ROUTE_OVERRIDES[template];
    return {
      expectedStatus: override?.expectedStatus,
      path: override?.path ?? fillRouteTemplate(template),
      template,
    };
  });
}

export const REDIRECT_ROUTES: SmokeRoute[] = [
  ...buildRoutes(templatesForBucket('redirect')),
  { path: '/?code=test', template: '/' },
];

export const PUBLIC_PAGE_ROUTES: SmokeRoute[] = [
  ...buildRoutes(templatesForBucket('public')),
  { expectedStatus: 404, path: '/nonexistent-page', template: '/[...rest]' },
];

export const AUTHENTICATED_PAGE_ROUTES: SmokeRoute[] = buildRoutes(
  templatesForBucket('authenticated')
);

export async function mockBetaRouteHandlers(page: Page) {
  // The /beta route handlers need MongoDB, which isn't available here or in CI
  await page.route('**/beta/**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        body: JSON.stringify({ data: [] }),
        contentType: 'application/json',
        status: 200,
      });
    } else {
      await route.fallback();
    }
  });
}

export async function addSessionCookie(
  context: BrowserContext,
  appUri: string
) {
  const url = new URL(appUri);
  const sealedSession = await sealData(
    {
      memberships: [KPD.id],
      redirAfterLogin: null,
      tokenData: {
        access_token: 'test-access-token',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        token_type: 'bearer',
      },
    },
    {
      password: SESSION_PASSWORD,
    }
  );

  await context.addCookies([
    {
      domain: url.hostname,
      httpOnly: true,
      name: 'zsid',
      path: '/',
      sameSite: 'Lax',
      value: sealedSession,
    },
  ]);
}

export function setupFeatureFlags() {
  process.env.FEAT_AREAS = '*';
  process.env.FEAT_CALL = '*';
  process.env.FEAT_OFFICIALS = '*';
  process.env.FEAT_TASKS = '*';
  process.env.FEAT_UNAUTH_EVENT_SIGNUP = '*';
  process.env.MAPLIBRE_STYLE ||= 'https://example.com/map-style.json';
}

export function setupSmokeApiMocks(moxy: NextWorkerFixtures['moxy']) {
  moxy.setZetkinApiMock('/orgs', 'get', [KPD]);
  moxy.setZetkinApiMock('/orgs/', 'get', [KPD]);
  moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  moxy.setMock('/v1/orgs/1/avatar', 'get', { status: 404 });
  moxy.setMock('/v1/users/1/avatar', 'get', { status: 404 });
  moxy.setMock('/v1/orgs/1/people/1/avatar', 'get', { status: 404 });
  moxy.setMock('/v1/orgs/1/people/2/avatar', 'get', { status: 404 });
  moxy.setZetkinApiMock('/orgs/1/actions', 'get', [event]);
  moxy.setZetkinApiMock('/orgs/1/actions/1', 'get', event);
  moxy.setZetkinApiMock('/orgs/1/actions/1/participants', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/actions/1/responses', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/actions/1/stats', 'get', {
    num_booked: 0,
    num_pending: 0,
    num_reminded: 0,
    num_signups: 0,
  });
  moxy.setZetkinApiMock('/orgs/1/activities', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/area_assignments', 'get', [areaAssignment]);
  moxy.setZetkinApiMock('/orgs/1/area_assignments/1', 'get', areaAssignment);
  moxy.setZetkinApiMock('/orgs/1/call_assignments', 'get', [callAssignment]);
  moxy.setZetkinApiMock('/orgs/1/call_assignments/1', 'get', callAssignment);
  moxy.setZetkinApiMock('/orgs/1/call_assignments/1/callers', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/call_assignments/1/calls', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/call_assignments/1/stats', 'get', {
    num_blocked: {
      allocated: 0,
      any: 0,
      call_back_after: 0,
      cooldown: 0,
      no_number: 0,
      organizer_action_needed: 0,
    },
    num_calls_made: 0,
    num_calls_reached: 0,
    num_goal_matches: 0,
    num_remaining_targets: 0,
    num_target_matches: 0,
  });
  moxy.setZetkinApiMock('/orgs/1/campaigns', 'get', [
    ReferendumSignatures,
    WelcomeNewMembers,
  ]);
  moxy.setZetkinApiMock('/orgs/1/campaigns/1', 'get', ReferendumSignatures);
  moxy.setZetkinApiMock('/orgs/1/campaigns/1/actions', 'get', [event]);
  moxy.setZetkinApiMock('/orgs/1/campaigns/1/call_assignments', 'get', [
    callAssignment,
  ]);
  moxy.setZetkinApiMock('/orgs/1/campaigns/1/surveys', 'get', [
    KPDMembershipSurvey,
  ]);
  moxy.setZetkinApiMock('/orgs/1/campaigns/1/tasks', 'get', [SpeakToFriend]);
  moxy.setZetkinApiMock('/orgs/1/emails', 'get', [email]);
  moxy.setZetkinApiMock('/orgs/1/emails/1', 'get', email);
  moxy.setZetkinApiMock('/orgs/1/emails/1/links', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/emails/1/recipients', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/emails/1/stats', 'get', {
    blocked: 0,
    clicked: 0,
    errors: 0,
    opened: 0,
    sent: 0,
    targets: 0,
  });
  moxy.setZetkinApiMock('/orgs/1/emails/configs', 'get', [email.config]);
  moxy.setZetkinApiMock('/orgs/1/email_themes', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/email_themes/1', 'get', {
    frame_mjml: null,
    id: 1,
  });
  moxy.setZetkinApiMock('/orgs/1/join_forms', 'get', [joinForm]);
  moxy.setZetkinApiMock('/orgs/1/join_forms/1', 'get', joinForm);
  moxy.setZetkinApiMock('/orgs/1/join_submissions', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/journeys', 'get', [MemberOnboarding]);
  moxy.setZetkinApiMock('/orgs/1/journeys/1', 'get', MemberOnboarding);
  moxy.setZetkinApiMock('/orgs/1/journeys/1/instances', 'get', [
    ClarasOnboarding,
  ]);
  moxy.setZetkinApiMock('/orgs/1/journey_instances/1', 'get', ClarasOnboarding);
  moxy.setZetkinApiMock(
    '/orgs/1/journey_instances/1/timeline/updates',
    'get',
    []
  );
  moxy.setZetkinApiMock(
    '/orgs/1/journeys/1/instances/1',
    'get',
    ClarasOnboarding
  );
  moxy.setZetkinApiMock('/orgs/1/journeys/1/instances/1/updates', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/people/1', 'get', ClaraZetkin);
  moxy.setZetkinApiMock('/orgs/1/people/1/connections', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/people/1/journey_instances', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/people/1/journeys', 'get', [ClarasOnboarding]);
  moxy.setZetkinApiMock('/orgs/1/people/1/organizations', 'get', [KPD]);
  moxy.setZetkinApiMock('/orgs/1/people/1/tags', 'get', [
    ActivistTag,
    OrganizerTag,
  ]);
  moxy.setZetkinApiMock('/orgs/1/people/duplicates', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/people/fields', 'get', AllCustomFields);
  moxy.setZetkinApiMock('/orgs/1/people/queries', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/people/queries/1', 'get', {
    filter_spec: [],
    id: 1,
    title: 'Smoke query',
  });
  moxy.setZetkinApiMock('/orgs/1/people/queries/ephemeral/stats', 'post', {
    size: 0,
  });
  moxy.setZetkinApiMock('/orgs/1/people/tags', 'get', [
    ActivistTag,
    OrganizerTag,
  ]);
  moxy.setZetkinApiMock('/orgs/1/people/view_folders', 'get', [folder]);
  moxy.setZetkinApiMock('/orgs/1/people/view_folders/1', 'get', folder);
  moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [
    AllMembers,
    callBlockedView,
  ]);
  moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
  moxy.setZetkinApiMock('/orgs/1/people/views/1/access', 'get', []);
  moxy.setZetkinApiMock(
    '/orgs/1/people/views/1/columns',
    'get',
    AllMembersColumns
  );
  moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
  moxy.setZetkinApiMock('/orgs/1/people/views/2', 'get', callBlockedView);
  moxy.setZetkinApiMock('/orgs/1/people/views/2/access', 'get', []);
  moxy.setZetkinApiMock(
    '/orgs/1/people/views/2/columns',
    'get',
    callBlockedColumns
  );
  moxy.setZetkinApiMock('/orgs/1/people/views/2/rows', 'get', AllMembersRows);
  moxy.setZetkinApiMock('/orgs/1/officials', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/search/callassignment', 'post', []);
  moxy.setZetkinApiMock('/orgs/1/search/campaign', 'post', []);
  moxy.setZetkinApiMock('/orgs/1/search/journeyinstance', 'post', []);
  moxy.setZetkinApiMock('/orgs/1/search/person', 'post', [
    ClaraZetkin,
    RosaLuxemburg,
  ]);
  moxy.setZetkinApiMock('/orgs/1/search/survey', 'post', []);
  moxy.setZetkinApiMock('/orgs/1/search/surveysubmission', 'post', []);
  moxy.setZetkinApiMock('/orgs/1/search/task', 'post', []);
  moxy.setZetkinApiMock('/orgs/1/search/view', 'post', []);
  moxy.setZetkinApiMock('/orgs/1/sub_organizations', 'get', []);
  moxy.setMock('/v1/orgs/1/sub_organizations', 'get', {
    data: { data: [] },
  });
  moxy.setZetkinApiMock('/orgs/1/survey_submissions', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/surveys', 'get', [campaignSurvey]);
  moxy.setZetkinApiMock('/orgs/1/surveys/1', 'get', campaignSurvey);
  moxy.setZetkinApiMock('/orgs/1/surveys/1/submissions', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/tag_groups', 'get', []);
  moxy.setZetkinApiMock('/orgs/1/tasks', 'get', [SpeakToFriend]);
  moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', SpeakToFriend);
  moxy.setZetkinApiMock('/orgs/1/tasks/1/assigned', 'get', []);
  moxy.setZetkinApiMock('/users/me/action_responses', 'get', []);
  moxy.setZetkinApiMock('/users/me/actions', 'get', []);
  moxy.setZetkinApiMock('/users/me/call_assignments', 'get', [callAssignment]);
  moxy.setZetkinApiMock('/users/me/outgoing_calls', 'get', []);
  moxy.setZetkinApiMock('/users/me/following', 'get', Memberships);
  moxy.setZetkinApiMock('/users/me/memberships/1', 'get', Memberships[0]);
  moxy.setZetkinApiMock(
    '/users/me/verification_codes/test-token',
    'put',
    undefined,
    404
  );

  moxy.setMock('/v2/users/me/area_assignments', 'get', {
    data: { data: [areaAssignment] },
  });
  moxy.setMock('/v2/orgs/1/area_assignments', 'get', {
    data: { data: [areaAssignment] },
  });
  moxy.setMock('/v2/orgs/1/areas', 'get', {
    data: { data: [] },
  });
  moxy.setMock('/v2/orgs/1/locations', 'get', {
    data: { data: [] },
  });
  moxy.setMock('/v2/orgs/1/area_assignments/1', 'get', {
    data: { data: areaAssignment },
  });
  moxy.setMock('/v2/orgs/1/area_assignments/1/areas', 'get', {
    data: { data: [assignmentArea] },
  });
  moxy.setMock('/v2/orgs/1/area_assignments/1/assignees', 'get', {
    data: { data: [] },
  });
  moxy.setMock('/v2/orgs/1/area_assignments/1/locations', 'get', {
    data: { data: [location] },
  });
  moxy.setMock('/v2/orgs/1/area_assignments/1/metrics', 'get', {
    data: { data: [] },
  });
  moxy.setMock('/v2/orgs/1/area_assignments/1/stats', 'get', {
    data: {
      data: {
        metrics: [],
        num_households: 0,
        num_households_successfully_visited: null,
        num_households_visited: null,
        num_locations: 1,
        num_locations_visited: 0,
        num_successful_visits: 0,
        num_visits: 0,
      },
    },
  });
}

function watchRouteErrors(page: Page) {
  const errors: string[] = [];

  const onPageError = (error: Error) => {
    errors.push(error.message);
  };

  const onConsoleMessage = (message: ConsoleMessage) => {
    const text = message.text();
    if (
      message.type() === 'error' &&
      /@formatjs\/intl Error|Missing message:/.test(text)
    ) {
      errors.push(text);
    }
  };

  page.on('pageerror', onPageError);
  page.on('console', onConsoleMessage);

  return {
    dispose: () => {
      page.off('pageerror', onPageError);
      page.off('console', onConsoleMessage);
    },
    errors,
  };
}

export async function expectRouteHealthy(
  page: Page,
  appUri: string,
  routePath: string,
  expectedStatus = 200
) {
  const routeErrors = watchRouteErrors(page);
  const imageHandler = async (route: Route) => {
    await route.fulfill({ body: '', status: 204 });
  };
  try {
    await page.route('**/_next/image**', imageHandler);
    const response = await page.goto(appUri + routePath, {
      waitUntil: 'domcontentloaded',
    });

    await page
      .waitForLoadState('networkidle', { timeout: 5000 })
      .catch(() => {});
    await page.waitForTimeout(250);

    expect.soft(response, routePath).not.toBeNull();
    expect.soft(response?.status(), routePath).toBe(expectedStatus);
    expect.soft(routeErrors.errors, routePath).toEqual([]);
  } finally {
    await page.unroute('**/_next/image**', imageHandler);
    routeErrors.dispose();
  }
}

export async function routePath(route: SmokeRoute) {
  return typeof route.path === 'function' ? await route.path() : route.path;
}

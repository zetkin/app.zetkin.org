import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
// @ts-expect-error - fast-levenshtein doesn't have type definitions
import { distance } from 'fast-levenshtein';

import { EventSignupModel } from 'features/events/models';
import { ApiClientError } from 'core/api/errors';
import BackendApiClient from 'core/api/client/BackendApiClient';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinPerson } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    eventId: string;
    orgId: string;
  };
};

type BookRequestBody = {
  signupId: string;
};

type MatchArgs = {
  apiClient: BackendApiClient;
  email?: string;
  firstName: string;
  lastName: string;
  orgId: number;
  phone?: string;
};

async function findExactMatch({
  apiClient,
  email,
  firstName,
  lastName,
  orgId,
  phone,
}: MatchArgs): Promise<number | null> {
  if ((!email && !phone) || !firstName || !lastName) {
    return null;
  }

  const query = `${firstName} ${lastName}`.trim();

  if (query.length < 3) {
    return null;
  }

  try {
    const candidates = await apiClient.post<ZetkinPerson[], { q: string }>(
      `/api/orgs/${orgId}/search/person`,
      { q: query }
    );

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);

    const match = candidates.find((person) => {
      if (!fuzzyNameMatch(person.first_name, firstName)) {
        return false;
      }
      if (!fuzzyNameMatch(person.last_name, lastName)) {
        return false;
      }

      if (normalizedEmail) {
        const candidateEmail = person.email?.trim().toLowerCase();
        if (candidateEmail !== normalizedEmail) {
          return false;
        }
      }

      if (normalizedPhone) {
        const candidatePhone = normalizePhone(person.phone || undefined);
        if (candidatePhone !== normalizedPhone) {
          return false;
        }
      }

      return true;
    });

    return match?.id ?? null;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) {
      return null;
    }
    return null;
  }
}

function normalizePhone(phone?: string | null): string | null {
  if (!phone) {
    return null;
  }

  try {
    const parsed = parsePhoneNumberFromString(phone);
    if (parsed?.isValid()) {
      return parsed.number;
    }
  } catch {
    // Fall back to naive normalization below
  }

  return phone.replace(/[^\d]/g, '');
}

function fuzzyNameMatch(a?: string | null, b?: string | null): boolean {
  if (!a || !b) {
    return false;
  }
  const normalizedA = a.trim().toLowerCase();
  const normalizedB = b.trim().toLowerCase();

  if (normalizedA === normalizedB) {
    return true;
  }

  return distance(normalizedA, normalizedB) <= 1;
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request,
      roles: ['organizer', 'admin'],
    },
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const body: BookRequestBody = await request.json();
      const { signupId } = body;

      if (!signupId) {
        return NextResponse.json(
          { error: 'signupId is required' },
          { status: 400 }
        );
      }

      const signup = await EventSignupModel.findById(signupId);

      if (!signup) {
        return NextResponse.json(
          { error: 'Signup not found' },
          { status: 404 }
        );
      }

      const matchedPersonId = await findExactMatch({
        apiClient,
        email: signup.email,
        firstName: signup.first_name,
        lastName: signup.last_name,
        orgId,
        phone: signup.phone,
      });

      if (!matchedPersonId) {
        return NextResponse.json(
          { data: { matched: false, personId: null } },
          { status: 200 }
        );
      }

      try {
        // TODO: These two operations should be a single transaction in the future.
        await apiClient.put(
          `/api/orgs/${orgId}/actions/${params.eventId}/participants/${matchedPersonId}`
        );

        await EventSignupModel.findByIdAndDelete(signupId);

        return NextResponse.json(
          { data: { matched: true, personId: matchedPersonId } },
          { status: 200 }
        );
      } catch (err) {
        if (err instanceof ApiClientError) {
          return NextResponse.json(
            { error: 'Failed to book participant' },
            { status: err.status }
          );
        }
        return NextResponse.json(
          { error: 'Failed to book participant' },
          { status: 500 }
        );
      }
    }
  );
}

import mongoose from 'mongoose';
import { IncomingHttpHeaders } from 'http';
import { NextRequest, NextResponse } from 'next/server';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
// @ts-expect-error - fast-levenshtein doesn't have type definitions
import { distance } from 'fast-levenshtein';

import { EventSignupModel } from 'features/events/models';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ApiClientError } from 'core/api/errors';
import { ZetkinPerson } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    eventId: string;
    orgId: string;
  };
};

type EventSignupBody = {
  email?: string;
  first_name: string;
  gdpr_consent: boolean;
  last_name: string;
  phone?: string;
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));

  const eventSignups = await EventSignupModel.find({
    eventId: parseInt(params.eventId),
  });

  // Auto-match signups that don't have a person_id
  const unmatchedSignups = eventSignups.filter((signup) => !signup.person_id);

  if (unmatchedSignups.length > 0) {
    await Promise.all(
      unmatchedSignups.map(async (signup) => {
        const matchedPersonId = await autoMatchPerson({
          email: signup.email,
          firstName: signup.first_name,
          headers,
          lastName: signup.last_name,
          orgId: parseInt(params.orgId),
          phone: signup.phone,
        });

        if (matchedPersonId) {
          await EventSignupModel.findByIdAndUpdate(signup._id, {
            $set: { person_id: matchedPersonId },
          });
          signup.person_id = matchedPersonId;
        }
      })
    );
  }

  return NextResponse.json({ data: eventSignups }, { status: 200 });
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const body: EventSignupBody = await request.json();
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));

  if (!body.first_name || !body.last_name) {
    return NextResponse.json(
      { error: 'first_name and last_name are required' },
      { status: 400 }
    );
  }

  if (body.gdpr_consent !== true) {
    return NextResponse.json(
      { error: 'gdpr_consent is required' },
      { status: 400 }
    );
  }

  const eventSignup = await EventSignupModel.create({
    created: new Date(),
    email: body.email,
    eventId: parseInt(params.eventId),
    first_name: body.first_name,
    gdpr_consent: body.gdpr_consent,
    last_name: body.last_name,
    orgId: parseInt(params.orgId),
    phone: body.phone,
  });

  return NextResponse.json({ data: eventSignup }, { status: 201 });
}

type AutoMatchArgs = {
  email?: string;
  firstName: string;
  headers: IncomingHttpHeaders;
  lastName: string;
  orgId: number;
  phone?: string;
};

async function autoMatchPerson({
  email,
  firstName,
  headers,
  lastName,
  orgId,
  phone,
}: AutoMatchArgs): Promise<number | null> {
  if ((!email && !phone) || !firstName || !lastName) {
    return null;
  }

  const apiClient = new BackendApiClient(headers);
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
      const candidateEmail = person.email?.trim().toLowerCase();
      const candidatePhone = normalizePhone(person.phone || undefined);
      const emailMatches =
        normalizedEmail && candidateEmail
          ? normalizedEmail === candidateEmail
          : false;
      const phoneMatches =
        normalizedPhone && candidatePhone
          ? normalizedPhone === candidatePhone
          : false;

      if (!emailMatches && !phoneMatches) {
        return false;
      }

      const firstMatches = fuzzyNameMatch(person.first_name, firstName);
      const lastMatches = fuzzyNameMatch(person.last_name, lastName);

      return firstMatches && lastMatches;
    });

    return match?.id ?? null;
  } catch (err) {
    // Silently fail - matching is best-effort
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

export async function DELETE(request: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const { searchParams } = new URL(request.url);
  const signupId = searchParams.get('id');

  if (!signupId) {
    return NextResponse.json(
      { error: 'id query parameter is required' },
      { status: 400 }
    );
  }

  const result = await EventSignupModel.findByIdAndDelete(signupId);

  if (!result) {
    return NextResponse.json({ error: 'Signup not found' }, { status: 404 });
  }

  return NextResponse.json({ data: result }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const { searchParams } = new URL(request.url);
  const signupId = searchParams.get('id');

  if (!signupId) {
    return NextResponse.json(
      { error: 'id query parameter is required' },
      { status: 400 }
    );
  }

  const body = await request.json();

  if (!('person_id' in body)) {
    return NextResponse.json(
      { error: 'person_id is required in request body' },
      { status: 400 }
    );
  }

  const updateQuery =
    body.person_id === null || body.person_id === undefined
      ? { $unset: { person_id: 1 } }
      : { $set: { person_id: Number(body.person_id) } };

  const result = await EventSignupModel.findOneAndUpdate(
    { _id: signupId },
    updateQuery,
    { new: true }
  );

  if (!result) {
    return NextResponse.json({ error: 'Signup not found' }, { status: 404 });
  }

  return NextResponse.json({ data: result }, { status: 200 });
}

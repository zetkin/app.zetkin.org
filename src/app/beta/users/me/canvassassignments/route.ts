import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { IncomingHttpHeaders } from 'http';

import { IndividualCanvassAssignmentModel } from 'features/areas/models';
import { ZetkinIndividualCanvassAssignment } from 'features/areas/types';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinUser } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';

export async function GET(request: NextRequest) {
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  try {
    const currentUser = await apiClient.get<ZetkinUser>(`/api/users/me`);

    await mongoose.connect(process.env.MONGODB_URL || '');

    const individualCanvassAssignmentModels =
      await IndividualCanvassAssignmentModel.find({
        personId: currentUser.id,
      });

    const individualCanvassAssignments: ZetkinIndividualCanvassAssignment[] =
      individualCanvassAssignmentModels.map((model) => ({
        areaUrl: model.areaUrl,
        id: model._id.toString(),
        personId: model.personId,
      }));

    return Response.json({ data: individualCanvassAssignments });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return new NextResponse(null, { status: err.status });
    } else {
      return new NextResponse(null, { status: 500 });
    }
  }
}

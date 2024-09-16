import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { IncomingHttpHeaders } from 'http';

import { CanvassAssigneeModel } from 'features/areas/models';
import { ZetkinCanvassAssignee } from 'features/areas/types';
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

    const models = await CanvassAssigneeModel.find({
      id: currentUser.id,
    });

    const assignees: ZetkinCanvassAssignee[] = models.map((model) => ({
      canvassAssId: model.canvassAssId,
      id: model.id,
    }));

    return Response.json({ data: assignees });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return new NextResponse(null, { status: err.status });
    } else {
      return new NextResponse(null, { status: 500 });
    }
  }
}

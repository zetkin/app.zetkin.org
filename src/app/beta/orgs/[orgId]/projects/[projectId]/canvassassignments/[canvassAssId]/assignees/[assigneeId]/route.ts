import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { CanvassAssigneeModel } from 'features/areas/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

type RouteMeta = {
  params: {
    assigneeId: string;
    orgId: string;
  };
};

export async function PUT(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const model = new CanvassAssigneeModel({
        id: params.assigneeId,
      });

      await model.save();

      return NextResponse.json({
        data: {
          id: model.id,
        },
      });
    }
  );
}

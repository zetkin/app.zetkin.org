import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinVisitModel } from 'features/visitassignments/models';

type RouteMeta = {
  params: {
    orgId: string;
    visitAssId: string;
    visitId: string;
  };
};

export async function DELETE(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async () => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }
      const result = await ZetkinVisitModel.findOneAndDelete({
        id: params.visitId,
      });
      if (!result) {
        return new NextResponse(null, { status: 404 });
      }
      return new NextResponse(null, { status: 204 });
    }
  );
}

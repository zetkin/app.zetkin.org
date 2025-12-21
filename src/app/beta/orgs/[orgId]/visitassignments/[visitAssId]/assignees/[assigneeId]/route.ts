import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinVisitAssigneeModel } from 'features/visitassignments/models';
import { ZetkinUser } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    assigneeId: string;
    orgId: string;
    visitAssId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request,
      roles: ['admin'],
    },
    async () => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const assignee = await ZetkinVisitAssigneeModel.findOne({
        id: params.assigneeId,
        orgId: params.orgId,
        visitAssId: params.visitAssId,
      });

      if (!assignee) {
        return new NextResponse(
          JSON.stringify({ error: 'Assignee not found' }),
          { status: 404 }
        );
      }

      return NextResponse.json({ data: assignee });
    }
  );
}

export async function PUT(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request,
      roles: ['admin'],
    },
    async ({ apiClient, orgId }) => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const assigneeInfo = await apiClient.get<ZetkinUser>(
        `/api/orgs/${orgId}/people/${params.assigneeId}`
      );
      if (!assigneeInfo) {
        return new NextResponse(
          JSON.stringify({ error: 'Assignee not found' }),
          { status: 404 }
        );
      }

      const assigneeIdNum = parseInt(params.assigneeId, 10);
      const visitAssIdNum = parseInt(params.visitAssId, 10);

      const filter = {
        id: assigneeIdNum,
        orgId: orgId,
        visitAssId: visitAssIdNum,
      };
      const update = {
        $set: {
          excluded_tags: [],
          first_name: assigneeInfo.first_name,
          last_name: assigneeInfo.last_name,
          prioritized_tags: [],
        },
        $setOnInsert: {
          id: assigneeIdNum,
          orgId: orgId,
          visitAssId: visitAssIdNum,
        },
      };

      const visitAssigneeDoc = await ZetkinVisitAssigneeModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
          upsert: true,
        }
      );

      if (!visitAssigneeDoc) {
        return new NextResponse(
          JSON.stringify({ error: 'Failed to upsert assignee' }),
          { status: 500 }
        );
      }

      return NextResponse.json({ data: visitAssigneeDoc });
    }
  );
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId }) => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const payload = await request.json();

      const visitAssigneeModel =
        await ZetkinVisitAssigneeModel.findOneAndUpdate(
          {
            id: params.assigneeId,
            orgId,
            visitAssId: params.visitAssId,
          },
          {
            $set: {
              excluded_tags: payload.excluded_tags || [],
              prioritized_tags: payload.prioritized_tags || [],
            },
          },
          { new: true }
        );

      return NextResponse.json({
        data: visitAssigneeModel,
      });
    }
  );
}

export async function DELETE(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId }) => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const result = await ZetkinVisitAssigneeModel.findOneAndDelete({
        id: params.assigneeId,
        orgId,
        visitAssId: params.visitAssId,
      });
      if (!result) {
        return new NextResponse(null, { status: 404 });
      }

      return new NextResponse(null, { status: 204 });
    }
  );
}

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { PbxConfigModel } from 'features/voip/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

type RouteMeta = {
  params: {
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    { orgId: params.orgId, request, roles: ['admin'] },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const config = await PbxConfigModel.findOne({
        orgId: Number(params.orgId),
      });

      if (!config) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({ data: { url: config.url } });
    }
  );
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    { orgId: params.orgId, request, roles: ['admin'] },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const existing = await PbxConfigModel.findOne({
        orgId: Number(params.orgId),
      });

      if (existing) {
        return new NextResponse(null, { status: 409 });
      }

      const payload = await request.json();

      const config = await PbxConfigModel.create({
        orgId: Number(params.orgId),
        url: payload.url,
      });

      return NextResponse.json({ data: { url: config.url } }, { status: 201 });
    }
  );
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    { orgId: params.orgId, request, roles: ['admin'] },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const config = await PbxConfigModel.findOneAndUpdate(
        { orgId: Number(params.orgId) },
        { url: payload.url },
        { new: true }
      );

      if (!config) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({ data: { url: config.url } });
    }
  );
}

export async function DELETE(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    { orgId: params.orgId, request, roles: ['admin'] },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const config = await PbxConfigModel.findOneAndDelete({
        orgId: Number(params.orgId),
      });

      if (!config) {
        return new NextResponse(null, { status: 404 });
      }

      return new NextResponse(null, { status: 204 });
    }
  );
}

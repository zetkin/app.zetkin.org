import 'leaflet/dist/leaflet.css';
import { notFound } from 'next/navigation';

import AreaPage from 'features/areas/components/AreaPage';
import { AREAS, hasFeature } from 'utils/featureFlags';

interface PageProps {
  params: {
    areaId: string;
    orgId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { orgId, areaId } = params;
  const hasAreas = hasFeature(AREAS, parseInt(orgId), process.env);

  if (!hasAreas) {
    return notFound();
  }

  return <AreaPage areaId={areaId} orgId={parseInt(orgId)} />;
}

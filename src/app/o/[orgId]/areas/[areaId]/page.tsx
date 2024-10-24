import { Box } from '@mui/system';
import 'leaflet/dist/leaflet.css';
import { notFound } from 'next/navigation';

import { AREAS, hasFeature } from 'utils/featureFlags';

interface PageProps {
  params: {
    areaId: string;
    orgId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { orgId } = params;
  const hasAreas = hasFeature(AREAS, parseInt(orgId), process.env);

  if (!hasAreas) {
    return notFound();
  }

  return <Box />;
}

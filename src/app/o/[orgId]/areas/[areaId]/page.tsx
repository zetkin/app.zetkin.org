import 'leaflet/dist/leaflet.css';

import AreaPage from 'features/areas/components/AreaPage';

interface PageProps {
  params: {
    areaId: string;
    orgId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { orgId, areaId } = params;
  return <AreaPage areaId={areaId} orgId={parseInt(orgId)} />;
}
